const CircleContainer = styled.div`
  position: absolute;
  top: 0%;
  right: 0%;
  width: 100%;
  height: 100%;
  z-index: 2;
  width: 50%;

  @media screen and (max-width: 1422px) {
    width: 100%;
  }
`;

const SectorUI = styled.div`
  position: absolute;
  top: ${(p) => p.shift}rem;
  left: ${(p) => p.shift}rem;
  width: 200%;
  height: 250%;
  border-radius: 50%;
  background: linear-gradient(90deg, ${(p) => p.color[0]} 50%, transparent 50%)
    0 0;
  background-repeat: no-repeat;
`;

return (
  <CircleContainer>
    <SectorUI color={["#e5e4f5", "efe5f1"]} shift={-5} />
    <SectorUI color={["#d5d5eb", "efe5f1"]} shift={-0} />
    <SectorUI color={["#cacae2", "efe5f1"]} shift={5} />
    <SectorUI color={["#c4c1dd", "efe5f1"]} shift={10} />
  </CircleContainer>
);
