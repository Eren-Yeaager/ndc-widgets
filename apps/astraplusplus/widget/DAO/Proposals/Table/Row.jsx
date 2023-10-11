const {
    multiSelectMode,
    daoId,
    proposal,
    proposal_type,
    proposal_id,
    i,
    isAllowedTo,
    isCongressDaoID
} = props;
const accountId = context.accountId;

// --- check user permissions
const proposalKinds = {
    ChangeConfig: "config",
    ChangePolicy: "policy",
    AddMemberToRole: "add_member_to_role",
    RemoveMemberFromRole: "remove_member_from_role",
    FunctionCall: isCongressDaoID ? "FunctionCall" : "call",
    UpgradeSelf: "upgrade_self",
    UpgradeRemote: "upgrade_remote",
    Transfer: "transfer",
    SetStakingContract: "set_vote_token",
    AddBounty: "add_bounty",
    BountyDone: "bounty_done",
    Vote: "vote",
    FactoryInfoUpdate: "factory_info_update",
    ChangePolicyAddOrUpdateRole: "policy_add_or_update_role",
    ChangePolicyRemoveRole: "policy_remove_role",
    ChangePolicyUpdateDefaultVotePolicy: "policy_update_default_vote_policy",
    ChangePolicyUpdateParameters: "policy_update_parameters",
    Text: "Text",
    FundingRequest: "FundingRequest",
    RecurrentFundingRequest: "RecurrentFundingRequest"
};

const actions = {
    AddProposal: "AddProposal",
    VoteApprove: "VoteApprove",
    VoteReject: "VoteReject",
    VoteRemove: "VoteRemove"
};

const kindName =
    typeof proposal.kind === "string"
        ? proposal.kind
        : isCongressDaoID
        ? Object.keys(proposal.kind)?.[0]
        : typeof proposal.kind.typeEnum === "string"
        ? proposal.kind.typeEnum
        : Object.keys(proposal.kind)[0];

const isAllowedToVote = [
    isAllowedTo(proposalKinds[kindName], actions.VoteApprove),
    isAllowedTo(proposalKinds[kindName], actions.VoteReject),
    isAllowedTo(proposalKinds[kindName], actions.VoteRemove)
];

// --- end check user permissions

const formatDate = (date) => {
    date = new Date(Date(date));
    return `${
        [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ][date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
};

const voted = {
    yes: proposal.votes[accountId || ";;;"] === "Approve",
    no: proposal.votes[accountId || ";;;"] === "Reject",
    spam: proposal.votes[accountId || ";;;"] === "Remove"
};

const alreadyVoted = voted.yes || voted.no || voted.spam;

const canVote =
    isAllowedToVote.every((v) => v) &&
    proposal.status === "InProgress" &&
    !alreadyVoted;

const showMultiVote = multiSelectMode && canVote;

function renderStatus(statusName) {
    let statusicon;
    let statustext;
    let statusvariant;

    switch (statusName) {
        case "Approved":
        case "Vetoed":
        case "Executed":
        case "Accepted":
            statusicon = "bi bi-check-circle";
            statustext = statusName;
            statusvariant = "success";
            break;
        case "InProgress":
            statusicon = "spinner-border spinner-border-sm";
            statustext = "Progress";
            statusvariant = "primary";
            break;
        case "Expired":
            statusicon = "bi bi-x-circle";
            statustext = "Expired";
            statusvariant = "black";
            break;
        case "Failed":
            statusicon = "bi bi-x-circle";
            statustext = "Failed";
            statusvariant = "black";
            break;
        case "Rejected":
            statusicon = "bi bi-x-circle";
            statustext = "Rejected";
            statusvariant = "danger";
            break;
    }
    return (
        <Widget
            src="/*__@replace:nui__*//widget/Element.Badge"
            props={{
                children: (
                    <>
                        <i
                            className={statusicon}
                            style={{
                                fontSize: "18px",
                                marginRight: "5px",
                                borderWidth: "2px",
                                animationDuration: "8s"
                            }}
                        ></i>
                        {statustext}
                    </>
                ),
                variant: `${statusvariant} round`,
                size: "lg"
            }}
        />
    );
}

return (
    <tr
        style={
            !!multiSelectMode && !canVote
                ? {
                      opacity: 0.6
                  }
                : {}
        }
    >
        <th scope="row">
            <span className="id-value">#{proposal_id}</span>
        </th>
        <td>{formatDate(proposal.submission_time)}</td>
        <td>
            <Widget
                src="nearui.near/widget/Element.User"
                props={{
                    accountId: proposal.proposer,
                    options: {
                        showImage: false,
                        shortenLength: 12,
                        fontSize: 13
                    }
                }}
            />
        </td>
        <td className="text-center">{kindName}</td>
        <td className="text-center">{renderStatus(proposal.status)}</td>

        {multiSelectMode && (
            <td className="text-center" style={{ width: 200 }}>
                <Widget
                    src="/*__@appAccount__*//widget/DAO.Proposals.MultiVote"
                    props={{
                        daoId,
                        canVote,
                        proposal,
                        view: "multiVote"
                    }}
                />
            </td>
        )}
        <td style={{ width: 150 }}>
            <div className="d-flex justify-content-end">
                <Widget
                    src="nearui.near/widget/Layout.Modal"
                    props={{
                        toggle: (
                            <Widget
                                src="nearui.near/widget/Input.Button"
                                props={{
                                    children: "More details",
                                    variant:
                                        !!multiSelectMode && !canVote
                                            ? "disabled"
                                            : "info",
                                    disabled: !!multiSelectMode && !canVote
                                }}
                            />
                        ),
                        content: (
                            <div
                                style={{
                                    width: 700,
                                    maxWidth: "100%"
                                }}
                            >
                                <Widget
                                    src="astraplusplus.ndctools.near/widget/DAO.Proposals.Card.index"
                                    props={{
                                        daoId: daoId,
                                        proposalString:
                                            JSON.stringify(proposal),
                                        multiSelectMode: state.multiSelectMode,
                                        isCongressDaoID
                                    }}
                                />
                            </div>
                        )
                    }}
                />
            </div>
        </td>
    </tr>
);
