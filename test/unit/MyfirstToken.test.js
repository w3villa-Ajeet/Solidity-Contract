const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const ethers=require("ethers")
!developmentChains.includes(network.name) ? describe.skip : describe("WToken Local Test Case", async () => {
    let w3Token, owner,acc_1,acc_2
    const chainId = network.config.chainId
    beforeEach(async () => {
        accounts = await getNamedAccounts()
        owner=accounts.owner,
        acc_1=accounts.acc_1
        acc_2=accounts.acc_2
        await deployments.fixture(["FirstToken"])
        w3Token = await ethers.getContractFactory("FirstToken");
        // w3Token = await ethers.getContract("FirstToken", owner)
        console.log("w3token",w3Token);
        
    })
    

    describe("WToken", () => {
        it("should have correct name and symbol", async () => {
            const name = await w3Token.name();
            const symbol = await w3Token.symbol();
            console.log('name',name)
            console.log('symbol',symbol)
            expect(name).to.equal("FirstToken");
            expect(symbol).to.equal("MFT");
        });

        it("should have correct total supply", async () => {
            const totalSupply = await w3Token.totalSupply();
            expect(await ethers.utils.formatEther( totalSupply ) ).to.be.equal("1000000.0");
        });

        it("should assign initial balance to owner", async () => {
            const balance = await w3Token.balanceOf(owner);
            expect(await ethers.utils.formatEther( balance )).to.be.equal("1000000.0");
        });

        it("should allow transfer of tokens", async () => {
            const amount = ethers.BigNumber.from("100000000000000000000");
            await w3Token.transfer(acc_1, amount, { from: owner });
            const balance = await w3Token.balanceOf(acc_1);
            expect(amount).to.be.equal(balance);
        });

        it("should not allow transfer to zero address", async () => {
            const amount = ethers.BigNumber.from("100000000000000000000");
            await expect(w3Token.transfer("0x0000000000000000000000000000000000000000", amount, { from: owner }))
                .to.be.rejectedWith(Error, "ERC20: transfer to the zero address");
        });

        it("should not allow transfer of more than balance", async () => {
            const amount = ethers.BigNumber.from("2000000000000000000000000");
            await expect( w3Token.transfer(acc_1, amount, { from: owner })).to.be.revertedWith("ERC20: transfer amount exceeds balance")
        });

        it("should allow transferFrom", async () => {
            const amount = ethers.BigNumber.from("100000000000000000000");
            // Transfaring amount to acc1
            await w3Token.transfer(acc_1, amount, { from: owner });
            let signer= await ethers.getSigner(acc_1);
            await w3Token.connect(signer).transfer(acc_2, amount) 
            const balance = await w3Token.balanceOf(acc_2);
            expect(balance).to.be.equal(amount);
        });

        it("should not allow transferFrom more than approved amount", async () => {
            const amount = ethers.BigNumber.from("1000");
            let signer= await ethers.getSigner(acc_1);
            await w3Token.connect(signer).approve(acc_2, amount);
            signer= await ethers.getSigner(acc_2)
           const nwAmount= ethers.BigNumber.from("1005")
            await expect(w3Token.connect(signer).transferFrom(acc_1, acc_2, nwAmount))
                .to.be.rejectedWith(Error, "ERC20: insufficient allowance");
        });
    });

})