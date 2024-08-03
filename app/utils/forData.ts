import { subDistrictsByDistricts } from "~/config";
import {  BallotFrequencies } from "~/types";
import { Ballot, BallotModified } from "~/types/ratsinfoAPI";

export const sorterBallots = (prop: keyof BallotModified, isAsc: boolean) => (a: BallotModified, b: BallotModified) => {
  const aProp = a[prop].toString().toUpperCase()
  const bProp = b[prop].toString().toUpperCase()

  if (aProp < bProp) {
    return isAsc ? -1 : 1;
  } else if (aProp > bProp) {
    return isAsc ? 1 : -1;
  } else {
    return 0;
  }
};

 const modifyBallot = (ballot: Ballot): BallotModified => {
  let ballotModified: Partial<BallotModified> = {}
  const staticBallot = ballot
  const district = staticBallot.person_election_district_title as keyof typeof subDistrictsByDistricts
  const person_political_name = staticBallot.person_political_name
  const gemeinden = subDistrictsByDistricts[district]

  for (let i = 0; i < gemeinden.length; i += 1) {
    const oneSub = gemeinden[i]

    if (person_political_name.indexOf(oneSub) !== -1) {
      const person_name = person_political_name.replace(`-${oneSub}`, '')
      ballotModified = {...ballot, person_name, sub_district: oneSub }
    
    }
  }
  
  return ballotModified as BallotModified
}


const propsToCheckFrequencies: (keyof BallotModified)[] = ["vote_display", "person_election_district_title", "person_party", "sub_district"]
const propsToCheckVotings: (keyof BallotModified)[] = ["person_election_district_title", "person_party", "sub_district"]
export const ballotDataAndStats = (ballots: Ballot[]) => {

  const frequencies: BallotFrequencies = {
    vote_display: [],
    person_election_district_title: [],
    person_party: [],
    sub_district: []
  }

  let modifiedBallots: BallotModified[] = []

  for (let i = 0; i < ballots.length; i += 1) {
    const oneBallot: BallotModified = modifyBallot(ballots[i])

    modifiedBallots = [...modifiedBallots, oneBallot]

    const vote = oneBallot.vote

    let yes = 0
    let no = 0
    let absent = 0
    let abstention = 0;

    if (vote === 'yes') {
      yes += 1
    } else if (vote === 'no') {
      no += 1
    } else if (vote === 'absent') {
      absent += 1
    } else if (vote === 'abstention') {
      abstention += 1
    }

    for (let j = 0; j < propsToCheckFrequencies.length; j += 1) {
      const oneProp = propsToCheckFrequencies[j]
      const onePropValue = oneBallot[oneProp]
      const currentStoredVals = frequencies[oneProp]


      let isPresent = false;
      const isVoting = propsToCheckVotings.includes(oneProp)

      for (let k = 0; k < currentStoredVals.length; k += 1) {
        const storedItem = currentStoredVals[k]
        if (storedItem.val === onePropValue) {
          isPresent = true
          frequencies[oneProp][k].count += 1
          if (isVoting) {
            frequencies[oneProp][k].yes += yes
            frequencies[oneProp][k].no += no
            frequencies[oneProp][k].absent += absent
            frequencies[oneProp][k].abstention += abstention
          }
        }
      }

      if (!isPresent) {
        frequencies[oneProp].push({
          val: onePropValue,
          count: 1,
          yes,
          no,
          absent,
          abstention
        })
      }
    }
  }

  return { frequencies, modifiedBallots }
}