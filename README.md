# Decentralized Voting System

## Overview

The **Decentralized Voting System** is built on the Ethereum blockchain using Solidity for smart contract implementation and a web-based frontend for user interaction. This platform allows users to securely vote for candidates while ensuring that each user can cast their vote only once. The admin has the ability to add candidates, stop voting, and announce the winner.

## Features

- **Vote Once**: Users can vote for their preferred candidate, but only once.
- **Add Candidates**: The admin can register new candidates for the election.
- **Stop Voting**: The admin can terminate the voting process.
- **View Results**: The system displays the winning candidate once voting ends.
- **MetaMask Integration**: Transactions and interactions are facilitated through MetaMask.
- **Event Tracking**: All key actions, such as candidate votes cast, are recorded on the blockchain.

## Smart Contract (VotingSystem.sol)

The smart contract includes key functionalities:

- `addCandidate(string _name)`: Allows the admin to register new candidates.
- `vote(uint _candidateId)`: Enables users to vote once for their chosen candidate.
- `stopVoting()`: Allows the admin to close the voting process.
- `getWinner()`: Retrieves the winning candidate after voting ends.
- **Event Logging**: Tracks candidate additions, votes, and the end of the voting process.

## Frontend (index.html & script.js)

- Developed using **HTML, Bootstrap, and JavaScript**.
- Utilizes **Web3.js** for smart contract interaction.
- Provides an intuitive UI for voting and result viewing.
- Connects with **MetaMask** for secure voting transactions.

## Setup and Deployment

### Prerequisites

- Node.js installed
- Ethereum testnet
- MetaMask browser extension
- HTTP server package (`http-server`)

### Running the Project

#### Deploy the Smart Contract:

1. Compile and deploy `VotingSystem.sol` on a local blockchain (e.g., Ganache) or a testnet.
2. Copy the deployed contract address and update the corresponding address in script.js and admin.js

#### Start the Local Server:

Run the following command to launch the server:

```bash
http-server
```

This starts a local HTTP server to serve frontend files.

#### Connect MetaMask:

1. Open `index.html` in a browser.
2. Click **"Connect Wallet"** to link MetaMask.

#### Cast Votes & View Results:

- Users can select a candidate and vote.
- Admin can stop voting when necessary.
- The system will display the winner after voting ends.

### Resetting Voting Events

To reset voting data, redeploy the smart contract and update its address in `script.js` and admin.js.

## Unit Testing (VotingSystem.test.js)

Unit tests for `VotingSystem.sol` are implemented using **Hardhat and Ethers.js** to ensure correctness in voting, candidate registration, and result computation.

### Key Test Cases:

- **Contract Deployment**: Confirms the contract is deployed with the correct admin.
- **Adding Candidates**: Verifies that candidates are registered correctly.
- **Voting Process**: Ensures users can only vote once and for valid candidates.
- **Event Emission**: Ensures events are logged for candidate registration and voting.
- **Error Handling:**
  - Prevents duplicate votes by the same user.
  - Ensures only the admin can add candidates or stop voting.
  - Rejects votes for non-existent candidates.
- **State Changes**: Ensures that after voting ends, no more votes are accepted.
- **Function Return Values**: Validates `getWinner()` returns the correct election result.

## Hardhat and Project Structure

Hardhat and Ethers.js are used to enable seamless redeployment of the smart contract.

### Project Structure:

```
contracts/  - Contains VotingSystem.sol
 test/      - Contains VotingSystem.test.js
```

## Technologies Used

- **Solidity** - Smart contract development
- **Web3.js** - Blockchain interaction
- **MetaMask** - Wallet integration
- **Bootstrap** - Frontend styling
- **Testnet** - Local Ethereum environment
- **Hardhat & Ethers.js** - Smart contract deployment and testing

