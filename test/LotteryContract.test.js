const Lottery = artifacts.require("LotteryContract");

const chai = require("./setupchai.js");
const expect = chai.expect;

require("dotenv").config({path: ".env"});

contract("Lottery Test", async (accounts) => {

  const [deployerAccount, someAccount, anotherAccount] = accounts;

  beforeEach(async () => {
    this.myLottery = await Lottery.new(process.env.INITIAL_STAKE);
  })

  it('stake should be set', async () => {
    let instance = this.myLottery;
    expect(instance.stake()).to.eventually.be.a.bignumber.equal(process.env.INITIAL_STAKE);
  });

  it('one can enter the lottery', async () => {
    let instance = this.myLottery;
    expect(instance.enter({from: someAccount, value: web3.utils.toWei(process.env.INITIAL_STAKE, "wei")})).to.be.fulfilled;
  });

  it('money is transferred to the contract', async () => {
    let instance = this.myLottery;
    await instance.enter({from: someAccount, value: web3.utils.toWei(process.env.INITIAL_STAKE, "wei")});

    expect(web3.eth.getBalance(instance.address)).to.eventually.be.equal(process.env.INITIAL_STAKE);
  });

  it('entry account is on players list', async () => {
    let instance = this.myLottery;
    await instance.enter({from: someAccount, value: web3.utils.toWei(process.env.INITIAL_STAKE, "wei")});

    expect(instance.getPlayers()).to.eventually.be.an('array').that.includes(someAccount);
  });

  it('players list gets updated', async () => {
    let instance = this.myLottery;
    await instance.enter({from: someAccount, value: web3.utils.toWei(process.env.INITIAL_STAKE, "wei")});

    expect(instance.getPlayers()).to.eventually.have.lengthOf(1);
  });

  it('many ones can enter the lottery', async () => {
    let instance = this.myLottery;
    await instance.enter({from: someAccount, value: web3.utils.toWei(process.env.INITIAL_STAKE, "wei")});
    await instance.enter({from: anotherAccount, value: web3.utils.toWei(process.env.INITIAL_STAKE, "wei")});

    var players = await instance.getPlayers();
    expect(players.length).to.be.equal(2);
    expect(players[0]).to.be.equal(someAccount);
    expect(players[1]).to.be.equal(anotherAccount);
  });

  it('doesn\'t allow entries with less amount paid', async () => {
    let instance = this.myLottery;
    expect(instance.enter({from: anotherAccount, value: web3.utils.toWei((parseInt(process.env.INITIAL_STAKE) - 10).toString(), "wei")})).to.be.rejected;
  });

  it('only manager can pick the winner', async () => {
    let instance = this.myLottery;
    expect(instance.pickWinner({from: someAccount})).to.be.rejected;
  });

  it('winner gets it all', async () => {
    let instance = this.myLottery;
    await instance.enter({from: someAccount, value: web3.utils.toWei(process.env.INITIAL_STAKE, "wei")});

    const balanceBefore = await web3.eth.getBalance(someAccount);
    expect(instance.pickWinner({from: deployerAccount})).to.be.fulfilled;
    expect(instance.getPlayers()).to.eventually.be.an('array').which.is.empty;
    expect(web3.eth.getBalance(someAccount)).to.eventually.be.equal((parseInt(process.env.INITIAL_STAKE) + parseInt(balanceBefore)).toString());
  });

});