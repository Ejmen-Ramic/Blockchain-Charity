// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


contract Project {
    
        struct Donatee{
    
            string name;
            string message;
            address donateeAddress;
           
        }
    
        
    
    
    // Restrict functions to only valid donatee account user
        
       /* modifier OnlyDonatee {
            require(
                donatee == msg.sender,
                "You are not allowed to perform this action"
            );
            _; 
        }*/
    
        
        
        Donatee[] public donateeList;
        
        //The needy people would upload their data on the portal connected to the Blockchain system
    
        function _donateeDetails (string memory name, string memory message ) public /*OnlyDonatee*/{
             Donatee memory z;
                z.name= name;
                z.message= message;
                z.donateeAddress = msg.sender;
                donateeList.push(z);
                
                
        }
        
        //The community can access their data from the Blockchain and would be able to help them directly and safely
    
        function getListOfDonatees() public view returns (Donatee[] memory) {
            return donateeList;
        }
        
    //Q3:
    
        uint256 public threshold;
        uint256 max;
        address[] accounts; 
          address donatee;
          address donor;
          address charitableorg;
    
    // Restrict functions to only valid charitable organization account user
    
       /* modifier OnlyCharitableOrg{
            require(
                charitableorg == msg.sender,
                "You are not allowed to perform this action"
            );
            _; 
        }*/
    
        // Restrict functions to only valid donor account user
    
        struct Donor{
            address donorAddress;
        }
        /*modifier OnlyDonor {
            require(
                donor == msg.sender,
                "You are not allowed to perform this action"
            );
            _;
        } */
        
    
        uint256 private balance;
    
        // set threshold 
        function setThreshold(uint256 _threshold) public /*OnlyCharitableOrg*/{
            threshold = _threshold;
        }
    
        // Emitted when the donation amount > threshold
        event AboveLimitTransaction(
            string message,
            address donorAddress,
            uint256 amount
            );
        
        function donate(uint256 amount) public payable /*OnlyDonor*/{
                if(amount > 0){
                    if(amount > threshold){
                              // emitted when a donation amount > threshold
                        emit AboveLimitTransaction(
                    "Your donation amount is above the threshold! ", //message
                    msg.sender, //account address
                    amount //amount
                );
                    }else{
                        (balance += amount);
                    }
                }
                
        } 
    
    
    //Ejmen part: Q3, b part
    
    // Defining a constructor   
         
    
        function withdraw(uint256 amount) public payable /*OnlyDonor*/{
                if(amount > 0){
                    if(amount > threshold){
                        emit AboveLimitTransaction(
                    "Your withdrawl amount is above the threshold! ",
                    msg.sender,
                    amount
                );
                    }else{
                        (balance -= amount);
                    }
                }
                
        }
    
        function getBalance() public view returns (uint256){
            return balance;
        }
    
        function accountBalance() public view /*OnlyDonor*/ returns (uint256) {
            return address(this).balance;
        }
               
    
    
          
        }