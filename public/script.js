document.addEventListener("DOMContentLoaded", async function () {
    if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to use this application.");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contractAddress = "0xbd3a7ae7eee81364ac03f03dfeb80432117137ba"; 
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "addCandidate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string[]",
                    "name": "candidateNames",
                    "type": "string[]"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "CandidateAdded",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "stopVoting",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "candidateIndex",
                    "type": "uint256"
                }
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "voter",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "candidateIndex",
                    "type": "uint256"
                }
            ],
            "name": "VoteCasted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "winner",
                    "type": "string"
                }
            ],
            "name": "VotingEnded",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "admin",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "candidates",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "voteCount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "getCandidate",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getTotalCandidates",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getWinner",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "voters",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "votingEnded",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const candidateList = document.getElementById("candidateList");
    const voteStatus = document.getElementById("voteStatus");
    let selectedCandidateIndex = null;

    async function loadCandidates() {
        try {
            const totalCandidates = await contract.getTotalCandidates();
            candidateList.innerHTML = ""; 

            if (totalCandidates == 0) {
                candidateList.innerHTML = "<li class='list-group-item text-center'>No candidates available</li>";
                return;
            }

            for (let i = 0; i < totalCandidates; i++) {
                const candidate = await contract.getCandidate(i);
                const candidateName = candidate[0]; 
                const voteCount = candidate[1];  
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `${candidateName} <span>Votes: ${voteCount}</span> <input type="radio" name="candidate" value="${i}">`;
                li.onclick = () => selectCandidate(i);
                candidateList.appendChild(li);
            }
        } catch (error) {
            console.error("Error fetching candidates:", error);
            candidateList.innerHTML = "<li class='list-group-item text-danger'>Error loading candidates</li>";
        }
    }

    function selectCandidate(index) {
        selectedCandidateIndex = index;
    }

    window.voteForCandidate = async function () {
        if (selectedCandidateIndex === null) {
            voteStatus.textContent = "Please select a candidate.";
            return;
        }

        try {
            const hasVoted = await contract.voters(signer.getAddress());
            if (hasVoted) {
                voteStatus.textContent = "You have already voted.";
                return;
            }

            voteStatus.textContent = "Voting... Please wait.";
            const tx = await contract.vote(selectedCandidateIndex); 
            await tx.wait();

            voteStatus.textContent = "Vote submitted successfully!";
            loadCandidates(); // Reload candidates to show updated vote counts
        } catch (error) {
            console.error("Error voting:", error);
            voteStatus.textContent = "Error submitting vote. Try again.";
        }
    };

    window.getWinner = async function () {
        try {
            const votingEnded = await contract.votingEnded();
            if (!votingEnded) {
                winnerDisplay.textContent = "Voting is still ongoing. Winner cannot be determined yet.";
                return;
            }

            const winner = await contract.getWinner();
            winnerDisplay.textContent = `The winner is: ${winner}`;
        } catch (error) {
            console.error("Error getting winner:", error);
            winnerDisplay.textContent = "Error getting winner. Please try again.";
        }
    };

    await loadCandidates();
});
