// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingSystem {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public admin;
    Candidate[] public candidates;
    mapping(address => bool) public voters;
    bool public votingEnded;

    event CandidateAdded(string name);
    event VoteCasted(address indexed voter, uint256 indexed candidateIndex);
    event VotingEnded(string winner);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier votingActive() {
        require(!votingEnded, "Voting has ended");
        _;
    }

    constructor(string[] memory candidateNames) {
        admin = msg.sender;
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], 0));
        }
    }

    function addCandidate(string memory name) public onlyAdmin votingActive {
        candidates.push(Candidate(name, 0));
        emit CandidateAdded(name);
    }

    function vote(uint256 candidateIndex) public votingActive {
        require(!voters[msg.sender], "You have already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");
        
        voters[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
        emit VoteCasted(msg.sender, candidateIndex);
    }

    function stopVoting() public onlyAdmin {
        require(!votingEnded, "Voting is already ended");
        votingEnded = true;
        emit VotingEnded(getWinner());
    }

    function getCandidate(uint256 index) public view returns (string memory, uint256) {
        require(index < candidates.length, "Invalid index");
        return (candidates[index].name, candidates[index].voteCount);
    }

    function getTotalCandidates() public view returns (uint256) {
        return candidates.length;
    }

    function getWinner() public view returns (string memory) {
        require(votingEnded, "Voting is still ongoing");
        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }
        return candidates[winnerIndex].name;
    }
}
