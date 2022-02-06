const Project = artifacts.require("Project");


contract("Project", (accounts) => {
  let project; 
  // shorten commonly used functions
  let toWei = web3.utils.toWei;
  let fromWei = web3.utils.fromWei;
  before(async () => {
    project = await Project.deployed(); //instance
  });

  it("should set threashold successfully", async () => {
    await project.setThreshold(30, { from: accounts[0] });
    thres = await project.threshold();
    assert.equal(thres.toNumber(), 30);
  });


  it("should donate 5 ether", async () => {
    
    // donate amount 
    await project.donate(5, { from: accounts[1] });
    let bal_wei = await project.accountBalance({ from: accounts[1], 5: 5 });
    let bal_ether = fromWei(bal_wei, "ether");
    assert.equal(bal_ether, 0);
  });

  it("should withdraw 5 ether", async () => {
    let value = toWei("5", "ether");

    // withdraw amount 
    await project.withdraw(value, { from: accounts[1] });
    let bal_wei = await project.accountBalance({ from: accounts[0] });
    let bal_ether = fromWei(bal_wei, "ether");
    assert.equal(bal_ether, 0);
  });

});
