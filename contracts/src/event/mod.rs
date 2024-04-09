use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, near_bindgen, NearSchema};
use super::{Contract, DaoId};
use crate::{EventId};
use std::collections::HashMap;
use crate::dao::DAO;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum EventType {
    Offline,
    Online
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum EventStatus {
    Active,
    Inactive,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct EventInput {
    pub title: String,
    pub description: String,
    pub event_type: EventType,
    pub image_url: String,
    pub start_timestamp: Option<u64>,
    pub end_timestamp: Option<u64>,
}

impl EventInput {
    pub fn validate(&self) {
        assert!(!self.title.is_empty(), "Title is required");
        assert!(!self.description.is_empty(), "Description is required");
    }
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, NearSchema)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Event {
    pub id: EventId,
    pub dao_id: DaoId,
    pub owner_id: AccountId,
    pub title: String,
    pub description: String,
    pub event_type: EventType,
    pub image_url: String,
    pub start_timestamp: Option<u64>,
    pub end_timestamp: Option<u64>,
    pub status: EventStatus,
    pub metadata: HashMap<String, String>,
    pub hosts: HashMap<String, String>,
}

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
// #[serde(crate = "near_sdk::serde")]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct EventV2 {
//     pub title: String,
//     pub description: String,
// }

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "event_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedEvent {
    V1(Event),
    // V2(EventV2),
}

impl VersionedEvent {
    pub fn latest_version(self) -> Event {
        self.into()
    }

    // pub fn latest_version(self) -> EventV2 {
    //     self.into()
    // }
}

impl From<VersionedEvent> for Event {
    fn from(vi: VersionedEvent) -> Self {
        match vi {
            VersionedEvent::V1(v1) => v1,
            // VersionedEvent::V2(_) => unimplemented!(),
        }
    }
}

// impl From<VersionedEvent> for EventV2 {
//     fn from(vi: VersionedEvent) -> Self {
//         match vi {
//             VersionedEvent::V2(v2) => v2,
//             _ => unimplemented!(),
//         }
//     }
// }

impl From<Event> for VersionedEvent {
    fn from(event: Event) -> Self {
        VersionedEvent::V1(event)
    }
}

use crate::*;

// Event call functions
#[near_bindgen]
impl Contract {
    // Add new DAO Event
    // Access Level: DAO council
    pub fn add_event(
        &mut self,
        dao_id: DaoId,
        event_input: EventInput,
        metadata: HashMap<String, String>,
        hosts: HashMap<String, String>,
    ) -> EventId {
        self.validate_dao_ownership(&env::predecessor_account_id(), &dao_id);
        event_input.validate();

        self.total_events += 1;
        let id = self.total_events;
        let event = Event {
            id: id.clone(),
            dao_id: dao_id.clone(),
            title: event_input.title,
            description: event_input.description,
            event_type: event_input.event_type,
            image_url: event_input.image_url,
            start_timestamp: event_input.start_timestamp,
            end_timestamp: event_input.end_timestamp,
            owner_id: env::predecessor_account_id(),
            status: EventStatus::Active,
            metadata,
            hosts,
        };
        self.events.insert(&id, &event.into());

        self.add_dao_events_internal(&dao_id, id.clone());

        id
    }

    // Add event to DAO events list
    fn add_dao_events_internal(&mut self, dao_id: &DaoId, event_id: EventId) {
        let mut dao_events = self.dao_events.get(dao_id).unwrap_or(vec![]);
        dao_events.push(event_id);
        self.dao_events.insert(dao_id, &dao_events);
    }

    // Edit DAO Event
    // Access Level: DAO council
    pub fn edit_event(
        &mut self,
        id: EventId,
        event_input: EventInput,
        metadata: HashMap<String, String>,
        hosts: HashMap<String, String>,
    ) {
        let mut event: Event = self.get_event_by_id(&id).into();

        self.validate_event_edit_access(&event);
        event_input.validate();

        event.title = event_input.title;
        event.description = event_input.description;
        event.event_type = event_input.event_type;
        event.image_url = event_input.image_url;
        event.start_timestamp = event_input.start_timestamp;
        event.end_timestamp = event_input.end_timestamp;
        event.metadata = metadata;
        event.hosts = hosts;

        self.events.insert(&id, &event.into());
    }

    pub fn change_event_status(
        &mut self,
        id: EventId,
        status: EventStatus,
    ) {
        let mut event: Event = self.get_event_by_id(&id).into();
        self.validate_event_edit_access(&event);

        event.status = status;
        self.events.insert(&id, &event.into());
    }

    // Validate event edit access
    fn validate_event_edit_access(&self, event: &Event) {
        let dao: DAO = self.get_dao_by_id(&event.dao_id).into();
        assert!(dao.owners.contains(&env::predecessor_account_id()), "Must be DAO owner to edit event");
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use std::collections::HashMap;
    use crate::{Contract, DaoId, EventId};
    use crate::event::{Event, EventInput, EventStatus, EventType};
    use crate::tests::{setup_contract, create_new_dao};

    pub fn add_event(contract: &mut Contract, dao_id: DaoId) -> EventId {
        contract.add_event(
            dao_id.clone(),
            EventInput {
                title: "Test Event".to_string(),
                description: "Test event Description".to_string(),
                event_type: EventType::Offline,
                image_url: "https://test.com/image.png".to_string(),
                start_timestamp: Some(1630000000),
                end_timestamp: Some(1630000000),
            },
            HashMap::new(),
            HashMap::new(),
        )
    }

    #[test]
    pub fn test_add_event() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let event_id = add_event(&mut contract, dao_id.clone());
        let event:Event = contract.get_event_by_id(&event_id).into();

        assert_eq!(event.title, "Test Event", "Wrong title");
        assert_eq!(event.dao_id, dao_id, "Wrong DAO ID");
        assert_eq!(event.owner_id, context.signer_account_id, "Wrong owner ID");
        assert_eq!(event.description, "Test event Description", "Wrong description");
        assert_eq!(event.event_type, EventType::Offline, "Wrong event type");
        assert_eq!(event.image_url, "https://test.com/image.png", "Wrong image URL");
        assert_eq!(event.start_timestamp, Some(1630000000), "Wrong start timestamp");
        assert_eq!(event.end_timestamp, Some(1630000000), "Wrong end timestamp");

        // Check all events
        let dao_events:Vec<Event> = contract.get_all_events(1,100, Some(EventStatus::Active), Some(dao_id));
        assert_eq!(dao_events.len(), 1, "Wrong number of DAO events");

        // Check DAO events
        let dao_events:Vec<Event> = contract.get_all_events(1,100, Some(EventStatus::Active), Some(dao_id));
        assert_eq!(dao_events.len(), 1, "Wrong number of DAO events");
    }

    #[test]
    pub fn test_edit_event() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let event_id = add_event(&mut contract, dao_id.clone());

        contract.edit_event(
            event_id.clone(),
            EventInput {
                title: "New Test Event".to_string(),
                description: "New Test event Description".to_string(),
                event_type: EventType::Online,
                image_url: "https://new.com/image.png".to_string(),
                start_timestamp: Some(1630000000),
                end_timestamp: Some(1630000000),
            },
            HashMap::new(),
            HashMap::new(),
        );

        let event:Event = contract.get_event_by_id(&event_id).into();
        assert_eq!(event.title, "New Test Event", "Wrong title");
        assert_eq!(event.description, "New Test event Description", "Wrong description");
        assert_eq!(event.event_type, EventType::Online, "Wrong event type");
        assert_eq!(event.image_url, "https://new.com/image.png", "Wrong image URL");
    }

    #[test]
    pub fn test_change_status() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let event_id = add_event(&mut contract, dao_id.clone());

        contract.change_event_status(event_id.clone(), EventStatus::Inactive);

        let event:Event = contract.get_event_by_id(&event_id).into();
        assert_eq!(event.status, EventStatus::Inactive, "Wrong status");
    }
}