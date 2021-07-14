pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

// https://github.com/StephenGrider/EthereumCasts/blob/master/lottery/contracts/Lottery.sol
contract LotteryContract is Ownable {
    address public manager;
    address[] public players;
    uint public stake;
    address public winner;

    constructor(uint _stake) {
        manager = msg.sender;
        stake = _stake;
    }

    function enter() public payable {
        require(msg.value == stake * 1 wei);

        players.push(payable(msg.sender));
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public onlyOwner {
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        winner = players[index];
        players = new address payable[](0);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}