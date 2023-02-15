import { ethers } from  "ethers";
import React, { useEffect, useState } from "react";
import './App.css';
import blockX from './blockX.jpg';
import feedbackAbi from "./utils/feedbackabi.json"




function App() {
  const contractABI = feedbackAbi.abi;
  const contractAddress ="0x5FbDB2315678afecb367f032d93F642f64180aa3"
  
  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  
  const onNameChange = (event) => {
    setName(event.target.value);
   
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value);
   
  }


  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log("please open MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }


  //give feedback
  const giveFeedback = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();
        const feedbackContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("giving feedback")
        const feedbackTxn = await feedbackContract.sendFeedback(
          message ? message : "Awesome!",
          name ? name : "User"
        );

        await feedbackTxn.wait();

        console.log("feedback sent", feedbackTxn.hash);
        console.log("this is the sender",signer)

        console.log("feedbackSent");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

   // Function to fetch all feedbacks stored on-chain.
   const getFeedbacks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const feedbackContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        console.log("fetching memos from the blockchain..");
        const memos = await feedbackContract.returnFeedbacks();
        console.log("fetched!");
        setMemos(memos);
        console.log(memos)
      } else {
        console.log("Metamask is not connected");
      }
      
    } catch (error) {
      console.log(error);
    }
  };


    
  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();

    const { ethereum } = window;

  }, []);
  return (
    <div className="App">
      {currentAccount ? (
            <div>
                <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
  <div class="container flex flex-wrap items-center justify-between mx-auto">
    <a href="https://twitter.com/BPaapi" class="flex items-center">
        <img src={blockX} class="h-6 mr-3 sm:h-9" alt="blockX Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Block X</span>
    </a>
 
    <div class="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
       
        <p  className='block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>Wallet Connected
          
        </p>
      </ul>
    </div>
  </div>
</nav>


     <div className="flex items-center justify-center ">
     <form className = "bg-blue-400 shadow-md w-1/2 mt-5 rounded px-8 pt-6 pb-8 mb-2">
      <h1 className = "text-3xl text-white font-bold mb-5">Write a Feedback</h1>
      <div class="mb-4">
        
      <label class="block text-white text-sm font-bold mb-2" for="username">
        NAME
      </label>
      <input onChange={onNameChange}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="name"/>
    </div>
    <div class="mb-4">
      <label class="block text-white text-sm font-bold mb-2" for="username">
       MESSAGE
      </label>
      <input onChange={onMessageChange}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  type="text" placeholder="feedback"/>
    </div>
      </form>
     </div>

      <h1 className='mt-20 text-3xl font-bold'>Feedbacks Received</h1>
      <div className='flex items-center  justify-center my-10 '>
       <div className='border-2 rounded-sm w-1/2'>
        
       </div>
      </div>

      <button className='mt-10 bg-blue-400 rounded-md py-2 px-5 text-white font-bold'>
      Donate Here
      </button>
            </div>
      ): (
        <div>
          <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
            <div class="container flex flex-wrap items-center justify-between mx-auto">
              <a href="https://twitter.com/BPaapi" class="flex items-center">
                <img src={blockX} class="h-6 mr-3 sm:h-9" alt="BlockX Logo" />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Block X</span>
              </a>
 
          <div class="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">       
            <button onClick={connectWallet} className='block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'>Connect Wallet 
            </button>
      </ul>
    </div>
  </div>
</nav>
        <h1>......Waiting for metamask connection</h1>
        </div>
      )}
    
    </div>
  );
}

export default App;
