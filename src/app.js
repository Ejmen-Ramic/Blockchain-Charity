App = {
  loading: false, // set app loading state
  contracts: {},

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    // web3 == web3 connected to metamask
    // App.web3 == web3 connected to ganache
    // metamask is required to perfom transactions
    // blame metamask injected web3 for this confusion
    App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
    App.web3 = new Web3(App.web3Provider);

    // set owner
    App.owner = App.web3.eth.accounts[0];
  },

  loadAccount: async () => {
    // Set the current blockchain account
    // based on the currently selected account in metamask
    // dont confuse this with the contract owner
    App.account = web3.eth.accounts[0];
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const project = await $.getJSON("Project.json");

    // contracts{} allows fetching multiple contracts
    App.contracts.project = TruffleContract(project);
    App.contracts.project.setProvider(web3.currentProvider);

    // get deployed contract instance
    App.project = await App.contracts.project.deployed();
  },

  // get account balance or account balance depending on account
  getBalance: async () => {
    let value;
    if (App.account == App.owner) {
      value = await App.project.accountBalance({ from: App.account });
    } else {
      value = await App.project.getBalance({ from: App.account });
    }
    return value.toNumber();
  },

  setThreshold: async (value) => {
    await App.project
      .setThreshold(value, { from: App.account })
      
  },
  getThreshold: async () => {
    thres = await App.project.threshold({ from: App.account });
    return thres.toNumber();
  },

  // donate and update the balance 
  donate: async (amount) => {
    await App.project
      .donate({ from: App.account, value: amount })
      .then(() => {
        App.setBalance();
        // reset amount input
        $("#amount").val("");
      });
  },

  // withdraw then update the balance 
  withdraw: async (amount) => {
    await App.project.withdraw(amount, { from: App.account }).then(() => {
      App.setBalance();
      // reset amount input
      $("#amount").val("");
    });
  },

  
  // get all instances of above threshold limit event
  getAboveThresholdLimitTransaction: async () => {
    await App.project
      .AboveThresholdLimitTransaction({}, { fromBlock: 0, toBlock: "latest" })
      .get(async (error, result) => {
        if ((result != null) & !error) {
          for (var key in result) {
            
            $("#abovelim tbody").append(`<tr>
              <td class="pl-3 leading-10">${
                result[key].args.accountAddress
              }</td>
              <td class="text-center leading-10">${App.web3.fromWei(
                result[key].args.amount,
              )} </td>
            </tr>`);
          }
        } else {
          $("#abovelim tbody").append(`<tr>
              <td></td>
              <td class="text-center leading-10"> No Above threshold Limit Transactions</td>
              <td></td>
            </tr>`);
        }
      });
  },

  render: async () => {
    
    if (App.loading) {
      return;
    }

    
    App.loading = true;

    
    if (App.owner == App.account) {
      
      $("#type-label").html("Account Balance");

      // set threshold amount
      thres = await App.getThreshold();
      $("#threshold").html('${App.web3.fromWei(thres)}');
      

      $("#update-threshold").click(() => {
        new_val = $("#thres-val").val();
        if (new_val.length > 0) {
          new_val = App.web3.toWei(new_val);
          console.log(new_val);
          App.setThreshold(new_val);
        } else window.alert("Please Enter a valid Amount!");
      });
      await App.getAboveThresholdLimit();
     

      $("#thres-div").show();

      $("#admin").show();
    } else {
      $("#type-label").html("Balance");
      
      $("#donate").click(() => {
        amount = $("#amount").val();
        // make sure the amount field is not empty
        if (amount.length > 0) {
          amount = App.web3.toWei(amount);
          App.donate(amount);
        } else window.alert("Please Enter a valid Amount!");
      });

      
      $("#withdraw").click(async () => {
        amount = $("#amount").val();

        // make sure the amount field is not empty
        if (amount.length > 0) {
          amount = App.web3.toWei(amount);
          // make sure user has enough balance
          bal = await App.getBalance();
          if (amount <= bal) {
            App.withdraw(amount);
          } else {
            window.alert("Not Enough Balance in Account!");
            $("#amount").val("");
          }
        } else window.alert("Please Enter a valid Amount!");
      });

     
    }

    

   
    // set balance
    App.setBalance();

    // Update loading state
    App.loading = false;
  },
  setBalance: async () => {
    bal_wei = await App.getBalance()
    $("#bal-ether").html('${App.web3.fromWei(bal_wei, "ether")}');
  },

  
  
};

// start loading the app as soon as the window is loaded
$(() => {
  $(window).load(() => {
    App.load();
  });
});
