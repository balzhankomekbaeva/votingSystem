const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem", function () {
    let VotingSystem, votingSystem, owner, addr1, addr2;
    const candidateNames = ["Alice", "Bob", "Charlie"];

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        VotingSystem = await ethers.getContractFactory("VotingSystem");
        votingSystem = await VotingSystem.deploy(candidateNames);
        await votingSystem.deployed();
    });

    it("Should initialize with correct candidates", async function () {
        const candidates = await votingSystem.getCandidates();
        expect(candidates.length).to.equal(candidateNames.length);
        expect(candidates[0].name).to.equal("Alice");
    });

    it("Should allow a user to vote and update vote count", async function () {
        await votingSystem.connect(addr1).vote(1);
        const candidates = await votingSystem.getCandidates();
        expect(candidates[1].voteCount).to.equal(1);
    });

    it("Should prevent double voting", async function () {
        await votingSystem.connect(addr1).vote(1);
        await expect(votingSystem.connect(addr1).vote(2)).to.be.revertedWith("You have already voted");
    });

    it("Should allow admin to stop voting", async function () {
        await votingSystem.connect(owner).stopVoting();
        await expect(votingSystem.connect(addr1).vote(1)).to.be.revertedWith("Voting is not active");
    });

    it("Should correctly determine the winner", async function () {
        await votingSystem.connect(addr1).vote(1);
        await votingSystem.connect(addr2).vote(1);
        const winner = await votingSystem.getWinner();
        expect(winner).to.equal("Bob");
    });
});
