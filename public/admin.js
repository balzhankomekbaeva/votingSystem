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
    const adminStatus = document.getElementById("adminStatus");
    const votingStatus = document.getElementById("votingStatus");
  
    async function checkAdmin() {
        try {
            const adminAddress = await contract.admin();
            const userAddress = await signer.getAddress();
  
            if (adminAddress.toLowerCase() !== userAddress.toLowerCase()) {
                alert("You are not authorized to access the admin panel.");
                document.body.innerHTML = "<h2 class='text-center text-danger mt-5'>Access Denied</h2>";
                throw new Error("Unauthorized access.");
            }
        } catch (error) {
            console.error("Admin verification error:", error);
        }
    }
  
    window.addCandidate = async function () {
        try {
            const candidateName = document.getElementById("candidateName").value.trim();
            if (!candidateName) {
                adminStatus.textContent = "Candidate name cannot be empty.";
                return;
            }
  
            adminStatus.textContent = "Adding candidate... Please wait.";
            const tx = await contract.addCandidate(candidateName);
            await tx.wait();
  
            adminStatus.textContent = "Candidate added successfully!";
        } catch (error) {
            console.error("Error adding candidate:", error);
            adminStatus.textContent = "Error adding candidate. Ensure you're the admin.";
        }
    };
  
    window.stopVoting = async function () {
        try {
            votingStatus.textContent = "Stopping voting... Please wait.";
            const tx = await contract.stopVoting();
            await tx.wait();
  
            votingStatus.textContent = "Voting has been stopped!";
        } catch (error) {
            console.error("Error stopping voting:", error);
            votingStatus.textContent = "Error stopping voting. Ensure you're the admin.";
        }
    };
  
    await checkAdmin();
  });