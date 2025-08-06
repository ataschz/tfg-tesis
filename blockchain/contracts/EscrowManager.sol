// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EscrowManager {
    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE,
        DISPUTED
    }

    struct EscrowData {
        address buyer;
        address payable seller;
        uint256 contractAmount;
        uint256 startDate;
        uint256 endDate;
        string contractDescription;
        State currentState;
        bool exists;
    }

    address public administrator;
    mapping(string => EscrowData) public contracts;

    modifier onlyAdmin() {
        require(
            msg.sender == administrator,
            "Solo el administrador puede ejecutar esta funcion"
        );
        _;
    }

    modifier onlyBuyer(string memory contractId) {
        require(contracts[contractId].exists, "El contrato no existe");
        require(
            msg.sender == contracts[contractId].buyer,
            "Solo el buyer puede ejecutar esta funcion"
        );
        _;
    }

    modifier contractExists(string memory contractId) {
        require(contracts[contractId].exists, "El contrato no existe");
        _;
    }

    modifier inState(string memory contractId, State _state) {
        require(
            contracts[contractId].currentState == _state,
            "Estado del contrato invalido para esta operacion"
        );
        _;
    }

    modifier onlyBeforeEndDate(string memory contractId) {
        require(
            block.timestamp <= contracts[contractId].endDate,
            "El contrato ha expirado"
        );
        _;
    }

    event ContractCreated(
        string indexed contractId,
        address indexed buyer,
        address indexed seller,
        uint256 endDate
    );
    event FundsDeposited(
        string indexed contractId,
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );
    event FundsReleasedToSeller(
        string indexed contractId,
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );
    event FundsRefundedToBuyer(
        string indexed contractId,
        address indexed admin,
        uint256 amount,
        uint256 timestamp
    );
    event FundsReleasedByAdmin(
        string indexed contractId,
        address indexed admin,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );
    event ContractStateChanged(
        string indexed contractId,
        State previousState,
        State newState,
        uint256 timestamp
    );

    constructor() {
        administrator = msg.sender;
    }

    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Nueva direccion de admin invalida");
        administrator = newAdmin;
    }

    function createEscrow(
        string memory contractId,
        address _buyer,
        address payable _seller,
        uint256 _endDate,
        string memory _description
    ) external onlyAdmin {
        require(!contracts[contractId].exists, "El contrato ya existe");
        require(_buyer != address(0), "Direccion buyer invalida");
        require(_seller != address(0), "Direccion seller invalida");
        require(
            _endDate > block.timestamp,
            "La fecha de finalizacion debe ser futura"
        );

        contracts[contractId] = EscrowData({
            buyer: _buyer,
            seller: _seller,
            contractAmount: 0,
            startDate: 0,
            endDate: _endDate,
            contractDescription: _description,
            currentState: State.AWAITING_PAYMENT,
            exists: true
        });

        emit ContractCreated(contractId, _buyer, _seller, _endDate);
    }

    function deposit(
        string memory contractId
    )
        external
        payable
        onlyBuyer(contractId)
        inState(contractId, State.AWAITING_PAYMENT)
    {
        require(msg.value > 0, "El monto debe ser mayor a 0");

        contracts[contractId].contractAmount = msg.value;
        contracts[contractId].startDate = block.timestamp;
        contracts[contractId].currentState = State.AWAITING_DELIVERY;

        emit FundsDeposited(contractId, msg.sender, msg.value, block.timestamp);
        emit ContractStateChanged(
            contractId,
            State.AWAITING_PAYMENT,
            State.AWAITING_DELIVERY,
            block.timestamp
        );
    }

    function releaseFunds(
        string memory contractId
    )
        external
        onlyBuyer(contractId)
        inState(contractId, State.AWAITING_DELIVERY)
    {
        uint256 amount = contracts[contractId].contractAmount;
        require(amount > 0, "No hay fondos para liberar");

        contracts[contractId].currentState = State.COMPLETE;
        contracts[contractId].seller.transfer(amount);

        emit FundsReleasedToSeller(
            contractId,
            msg.sender,
            amount,
            block.timestamp
        );
        emit ContractStateChanged(
            contractId,
            State.AWAITING_DELIVERY,
            State.COMPLETE,
            block.timestamp
        );
    }

    function refundToBuyer(
        string memory contractId
    )
        external
        onlyAdmin
        contractExists(contractId)
        inState(contractId, State.AWAITING_DELIVERY)
    {
        uint256 amount = contracts[contractId].contractAmount;
        require(amount > 0, "No hay fondos para reembolsar");

        contracts[contractId].currentState = State.COMPLETE;
        payable(contracts[contractId].buyer).transfer(amount);

        emit FundsRefundedToBuyer(
            contractId,
            msg.sender,
            amount,
            block.timestamp
        );
        emit ContractStateChanged(
            contractId,
            State.AWAITING_DELIVERY,
            State.COMPLETE,
            block.timestamp
        );
    }

    function releaseToSeller(
        string memory contractId
    )
        external
        onlyAdmin
        contractExists(contractId)
        inState(contractId, State.AWAITING_DELIVERY)
    {
        uint256 amount = contracts[contractId].contractAmount;
        require(amount > 0, "No hay fondos para liberar");

        contracts[contractId].currentState = State.COMPLETE;
        contracts[contractId].seller.transfer(amount);

        emit FundsReleasedByAdmin(
            contractId,
            msg.sender,
            contracts[contractId].seller,
            amount,
            block.timestamp
        );
        emit ContractStateChanged(
            contractId,
            State.AWAITING_DELIVERY,
            State.COMPLETE,
            block.timestamp
        );
    }

    function setDisputed(
        string memory contractId
    )
        external
        onlyAdmin
        contractExists(contractId)
        inState(contractId, State.AWAITING_DELIVERY)
    {
        contracts[contractId].currentState = State.DISPUTED;
        emit ContractStateChanged(
            contractId,
            State.AWAITING_DELIVERY,
            State.DISPUTED,
            block.timestamp
        );
    }

    function resolveDispute(
        string memory contractId,
        bool favorBuyer
    )
        external
        onlyAdmin
        contractExists(contractId)
        inState(contractId, State.DISPUTED)
    {
        uint256 amount = contracts[contractId].contractAmount;
        require(amount > 0, "No hay fondos para resolver la disputa");

        contracts[contractId].currentState = State.COMPLETE;

        if (favorBuyer) {
            payable(contracts[contractId].buyer).transfer(amount);
            emit FundsRefundedToBuyer(
                contractId,
                msg.sender,
                amount,
                block.timestamp
            );
        } else {
            contracts[contractId].seller.transfer(amount);
            emit FundsReleasedByAdmin(
                contractId,
                msg.sender,
                contracts[contractId].seller,
                amount,
                block.timestamp
            );
        }

        emit ContractStateChanged(
            contractId,
            State.DISPUTED,
            State.COMPLETE,
            block.timestamp
        );
    }

    function getBalance(
        string memory contractId
    ) external view contractExists(contractId) returns (uint256) {
        return contracts[contractId].contractAmount;
    }

    function getContractInfo(
        string memory contractId
    )
        external
        view
        contractExists(contractId)
        returns (
            address _buyer,
            address _seller,
            address _administrator,
            uint256 _contractAmount,
            uint256 _startDate,
            uint256 _endDate,
            string memory _description,
            State _currentState,
            bool _isExpired
        )
    {
        EscrowData memory contractData = contracts[contractId];
        return (
            contractData.buyer,
            contractData.seller,
            administrator,
            contractData.contractAmount,
            contractData.startDate,
            contractData.endDate,
            contractData.contractDescription,
            contractData.currentState,
            block.timestamp > contractData.endDate
        );
    }

    function isContractExpired(
        string memory contractId
    ) external view contractExists(contractId) returns (bool) {
        return block.timestamp > contracts[contractId].endDate;
    }

    function getRemainingTime(
        string memory contractId
    ) external view contractExists(contractId) returns (uint256) {
        if (block.timestamp >= contracts[contractId].endDate) {
            return 0;
        }
        return contracts[contractId].endDate - block.timestamp;
    }

    function doesContractExist(
        string memory contractId
    ) external view returns (bool) {
        return contracts[contractId].exists;
    }
}
