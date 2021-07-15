import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

import LotteryContract from "./contracts/LotteryContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, sumInPlay: 0, lastWinner: '', players: [] };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      console.log(LotteryContract.networks[this.networkId].address);
      this.instance = new this.web3.eth.Contract(
        LotteryContract.abi,
        LotteryContract.networks[this.networkId] && LotteryContract.networks[this.networkId].address,
      );

      this.getPlayers();
      this.getSumInPLay();
      this.instanceManager = await this.instance.methods.manager().call();

      this.uuid = require("uuid");

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true, lastWinner: 'No winner yet...' });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  enterLottery = async () => {
    // await this.instance.methods.enter().send({from: this.accounts[0], value: 100000});
    await this.instance.methods.enter().send({from: this.web3.currentProvider.selectedAddress, value: 100000});
    this.getPlayers();
    this.getSumInPLay();
  };

  getPlayers = async () => {
    let players = await this.instance.methods.getPlayers().call();
    this.setState({ players: players });
  };

  getSumInPLay = async () => {
    let sum = await this.web3.eth.getBalance(this.instance.options.address);
    this.setState({ sumInPlay: sum });
  };

  pickWinner = async () => {
    await this.instance.methods.pickWinner().send({from: this.accounts[0]});
    this.getPlayers();
    this.getSumInPLay();
    let winner = await this.instance.methods.winner().call();
    this.setState({ lastWinner: winner, players: [] });
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <Container className="App">
        <h1>Welcome to the Blockchain Casino v0.1!</h1>
        <p>Where decentralized dreams come true.</p>
        <h2>Lottery Smart Contract Example</h2>
        <Jumbotron>
          <Button variant="secondary" onClick={this.enterLottery}>Enter Lottery</Button>
          <p>Number of Entries: {this.state.players.length}</p>

          <Table striped bordered align="center">
            <thead>
              <tr>
                <th>Addresses in Play</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.players.map((player) => (
                  <tr key={this.uuid.v4()}>
                    <td>{player}</td>
                    <td />
                  </tr>
                ))
              }
            </tbody>
          </Table>

          <p>Sum Wei in play: {this.state.sumInPlay}</p>
          <p>Last Winner: {this.state.lastWinner}</p>
        </Jumbotron>

        {this.accounts[0] === this.instanceManager &&
          <Button variant="primary" onClick={this.pickWinner}>Pick Winner</Button>
        }
      </Container>

    );
  }
}

export default App;
