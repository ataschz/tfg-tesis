// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Escrow {
    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, DISPUTED }
    
    State public currentState;
    
    address public buyer;
    address payable public seller;
    address public administrator;
    
    uint256 public contractAmount;
    uint256 public startDate;
    uint256 public endDate;
    string public contractDescription;
    
    modifier onlyBuyer() {
        require(msg.sender == buyer, "Solo el buyer puede ejecutar esta funcion");
        _;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == administrator, "Solo el administrador puede ejecutar esta funcion");
        _;
    }
    
    modifier onlyBeforeEndDate() {
        require(block.timestamp <= endDate, "El contrato ha expirado");
        _;
    }
    
    modifier inState(State _state) {
        require(currentState == _state, "Estado del contrato invalido para esta operacion");
        _;
    }
    
    event FundsDeposited(address indexed buyer, uint256 amount, uint256 timestamp);
    event FundsReleasedToSeller(address indexed buyer, uint256 amount, uint256 timestamp);
    event FundsRefundedToBuyer(address indexed admin, uint256 amount, uint256 timestamp);
    event FundsReleasedByAdmin(address indexed admin, address indexed recipient, uint256 amount, uint256 timestamp);
    event ContractStateChanged(State previousState, State newState, uint256 timestamp);
    
    constructor(
        address _buyer,
        address payable _seller,
        uint256 _endDate,
        string memory _description
    ) {
        require(_buyer != address(0), "Direccion buyer invalida");
        require(_seller != address(0), "Direccion seller invalida");
        require(_endDate > block.timestamp, "La fecha de finalizacion debe ser futura");
        
        buyer = _buyer;
        seller = _seller;
        administrator = msg.sender;
        endDate = _endDate;
        contractDescription = _description;
        currentState = State.AWAITING_PAYMENT;
    }
    
    function deposit() external payable onlyBuyer inState(State.AWAITING_PAYMENT) {
        require(msg.value > 0, "El monto debe ser mayor a 0");
        
        contractAmount = msg.value;
        startDate = block.timestamp;
        currentState = State.AWAITING_DELIVERY;
        
        emit FundsDeposited(msg.sender, msg.value, block.timestamp);
        emit ContractStateChanged(State.AWAITING_PAYMENT, State.AWAITING_DELIVERY, block.timestamp);
    }
    
    function releaseFunds() external onlyBuyer inState(State.AWAITING_DELIVERY) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay fondos para liberar");
        
        currentState = State.COMPLETE;
        seller.transfer(balance);
        
        emit FundsReleasedToSeller(msg.sender, balance, block.timestamp);
        emit ContractStateChanged(State.AWAITING_DELIVERY, State.COMPLETE, block.timestamp);
    }
    
    function refundToBuyer() external onlyAdmin inState(State.AWAITING_DELIVERY) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay fondos para reembolsar");
        
        currentState = State.COMPLETE;
        payable(buyer).transfer(balance);
        
        emit FundsRefundedToBuyer(msg.sender, balance, block.timestamp);
        emit ContractStateChanged(State.AWAITING_DELIVERY, State.COMPLETE, block.timestamp);
    }
    
    function releaseToSeller() external onlyAdmin inState(State.AWAITING_DELIVERY) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay fondos para liberar");
        
        currentState = State.COMPLETE;
        seller.transfer(balance);
        
        emit FundsReleasedByAdmin(msg.sender, seller, balance, block.timestamp);
        emit ContractStateChanged(State.AWAITING_DELIVERY, State.COMPLETE, block.timestamp);
    }
    
    function setDisputed() external onlyAdmin inState(State.AWAITING_DELIVERY) {
        currentState = State.DISPUTED;
        emit ContractStateChanged(State.AWAITING_DELIVERY, State.DISPUTED, block.timestamp);
    }
    
    function resolveDispute(bool favorBuyer) external onlyAdmin inState(State.DISPUTED) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No hay fondos para resolver la disputa");
        
        currentState = State.COMPLETE;
        
        if (favorBuyer) {
            payable(buyer).transfer(balance);
            emit FundsRefundedToBuyer(msg.sender, balance, block.timestamp);
        } else {
            seller.transfer(balance);
            emit FundsReleasedByAdmin(msg.sender, seller, balance, block.timestamp);
        }
        
        emit ContractStateChanged(State.DISPUTED, State.COMPLETE, block.timestamp);
    }
    
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function getContractInfo() external view returns (
        address _buyer,
        address _seller,
        address _administrator,
        uint256 _contractAmount,
        uint256 _currentBalance,
        uint256 _startDate,
        uint256 _endDate,
        string memory _description,
        State _currentState,
        bool _isExpired
    ) {
        return (
            buyer,
            seller,
            administrator,
            contractAmount,
            address(this).balance,
            startDate,
            endDate,
            contractDescription,
            currentState,
            block.timestamp > endDate
        );
    }
    
    function isContractExpired() external view returns (bool) {
        return block.timestamp > endDate;
    }
    
    function getRemainingTime() external view returns (uint256) {
        if (block.timestamp >= endDate) {
            return 0;
        }
        return endDate - block.timestamp;
    }
}