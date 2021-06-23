# Diff Metadata

## System(0)

### System.Calls

`Delete` `suicide`
`Add` `remark_with_event`

### System.Constants

`Delete` `MaximumBlockWeight`, `BlockExecutionWeight`, `ExtrinsicBaseWeight`, `MaximumBlockLength`
`Add` `BlockWeights`, `BlockLength`, `Version`, `SS58Prefix`

### System.Storage

`Modify` Account.default from `72 bytes`(0x00..0) to `80 bytes`(0x00..0)
`Modify` BlockWeight.default from `16 bytes`(0x00..0) to `24 bytes`(0x00..0)
`Modify` BlockWeight.type from `weight::ExtrinsicsWeight` to `ConsumedWeight`

`Delete` ExtrinsicRoot

`Add` UpgradedToTripleRefCount

## Scheduler(2)

### Scheduler.Calls

`Modify` {0,2,4,5}.type from `T as Trait` to `T as Config`

### Scheduler.Storage

`Modify` {0}.type from `T as Trait` to `T as Config`

## Babe(3)

### Babe.Errors

`Add` `InvalidEquivocationProof`, `InvalidKeyOwnershipProof`, `DuplicateOffenceReport`

### Babe.Storage

`Modify` {GenesisSlot, Current}.type from `u64` to `Slot`

`Rename` `NextEpochConfig` to `PendingEpochConfigChange`

`Add` `NextAuthorities`, `sasdsadsadasddsadsajdklajskldj`, `EpochConfig`, `NextEpochConfig`

## Indices(5)

### Indices.Errors

`Add` `NotAssigned`, `NotOwner`, `InUse`, `NotTransfer`, `Permanent`

## Balances(6)

### Balances.Errors

`Delete` `Overflow`

## TransactionPayment(7)

### TransactionPayment.Constants

`Modify` WeightToFee.value from `0400000000000000000000000000000000401F00000001` to `0401000000000000000000000000000000000000000001`

## Offences(9)

### Offences.Events

`Delete` Offence.arg[2] `bool`

### Offences.Storage

`Delete` `DeferredOffences`

## Grandpa(12)

### Grandpa.Storage

`Modify` storage.prefix from `GrandpaFinality` to `Grandpa`

## ImOnline(13)

### ImOnline.Storage

`Modify` AuthoredBlocks.type.DoubleMap.key2 from `T::ValidatorId` to `ValidatorId<T>`

## Democracy(15)

### Democracy.Errors

`Delete` `Overflow`, `Underflow`

## Council(16)

### Council.Calls

`Modify` {execute.proposal, propose.proposal}.type from `T as Trait<I>` to `T as Config<I>`

### Council.Storage

`Modify` Proposals.type from `Vec<T::Hash>` to `BoundedVec<T::Hash, T::MaxProposals>`
`Modify` ProposalOf.AsMap.value from `T as Trait<I>` to `T as Config<I>`

## TechnicalCommittee(17)

### TechnicalCommittee.Calls

`Modify` {execute.proposal, propose.proposal}.type from `T as Trait<I>` to `T as Config<I>`

### TechnicalCommittee.Storage

`Modify` Proposals.type from `Vec<T::Hash>` to `BoundedVec<T::Hash, T::MaxProposals>`
`Modify` ProposalOf.AsMap.value from `T as Trait<I>` to `T as Config<I>`

## Elections(18)

### Elections.Calls

`Delete` `report_defunct_voter`

`Add` `clean_defunct_voters`

### Elections.Constants

Delete `ModuleId`, `VotingBond`

`Add` `PalletId`, `VotingBondBase`, `VotingBondFactor`

### Elections.Errors

`Rename` `RunnerSubmit` to `RunnerUpSubmit`
`Rename` `InvalidCandidateCount` to `InvalidWitnessData`

### Elections.Events

`Rename` `MemberRenounced` to `Renounced`

`Delete` `VoterReported`

`Add` `CandidateSlashed`, `SeatHolderSlashed`

### Elections.Storage

`Modify` storage.prefix from `PhragmenElection` to `Elections`

`Modify` {Member, RunnersUp}.type from `Vec<(T::AccountId, BalanceOf<T>)>` to `Vec<SeatHolder<T::AccountId, BalanceOf<T>>>`
`Modify` Candidates.type from `Vec<T::AccountId>` to `Vec<(T::AccountId, BalanceOf<T>)>`
`Modify` Voting.AsMap.value from `(BalanceOf<T>, Vec<T::AccountId>)` to `Voter<T::AccountId, BalanceOf<T>>`

## TechnicalMembership(19)

### TechnicalMembership.Errors

`Add` `AlreadyMember`, `NotMember`

## Treasury(20)

### Treasury.Calls

`Delete` `report_awesome`, `retract_tip`, `tip_new`, `tip`, `close_tip`
`Delete` `propose_bounty`, `approve_bounty`, `propose_curator`, `unassign_curator`
`Delete` `accept_curator`, `award_bounty`, `claim_bounty`, `close_bounty`, `extend_bounty_expiry`

### Treasury.Constants

`Rename` `ModuleId` to `PalletId`

`Delete` `TipCountdown`, `TipFindersFee`, `TipReportDepositBase`, `DataDepositPerByte`, `BountyDepositBase`
`Delete` `BountyDepositPayoutDelay`, `BountyCuratorDeposit`, `BountyValueMinimum`, `MaximumReasonLength`

### Treasury.Error

`Add` `TooManyApprovals`

`Delete` `ReasonTooBig`, `AlreadyKnown`, `UnknownTip`, `NotFinder`, `StillOpen`, `Premature`
`Delete` `UnexpectedStatus`, `RequireCurator`, `InvalidValue`, `InvalidFee`, `PendingPayout`

### Treasury.Events

`Delete` `NewTip`, `TipClosing`, `TipClosed`, `TipRetracted`, `BountyProposed`, `BountyRejected`
`Delete` `BountyBecameActive`, `BountyAwarded`, `BountyClaimed`, `BountyCanceled`, `BountyExtended`

## Utility(22)

### Utility.Calls

`Modify` {batch.calls, as_derivative, batch_all}.type from `T as Trait` to `T as Config`

## Multisig(23)

### Multisig.Calls

`Modify` as_multi_threshold_1.call.type. from `T as Trait` to `T as Config`

### Multisig.Errors

`Rename` `WeightTooLow` to `MaxWeightTooLow`

## XStaking(27)

### XStaking.Events

`Modify` ForceChilled.arg[1] from `Vec<AccountId>` to `Vec<T::AccountId>`

## XGatewayRecords(29)

> The order of functions changes, it doesn't matter

## XGatewayCommon(30)

### XGatewayCommon.Events

`Modify` TrusteeSetChanged.arg[2] from `GenericTrusteeSessionInfo<AccountId>` to `GenericTrusteeSessionInfo<T::AccountId>`

## XSpot(32)

### XSpot.Events

`Modify`  {NewOrder, MakerOrderUpdated, TakerOrderUpdated, OrderExecuted, CanceledOrderUpdated}.arg[0] \
    from "AccountId, Balance, Price, BlockNumber" to "T::AccountId, BalanceOf<T>, T::Price, T::BlockNumber"

## Currencies(34)

### Currencies.Constants

`Rename` `NativeCurrencyId` to `GetNativeCurrencyId`

### Currencies.Events

`Modify` {all}.args from `CurrencyId`, `AccountId`, `Balance`, `Amount` \
    to `CurrencyIdOf<T>`, `T::AccountId`, `BalanceOf<T>`, `AmountOf<T>`

## Proxy(36)

### Proxy.Calls

`Modify` {proxy.arg[2], proxy_announced.arg[3]}.type from `T as Trait` to `T as Config`s
