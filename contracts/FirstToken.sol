// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FirstToken is ERC20 {
    constructor() ERC20("MyFirstToken", "MFT") {
        _mint(msg.sender, 1000000 * (10 ** uint256(18)));
    }
}

