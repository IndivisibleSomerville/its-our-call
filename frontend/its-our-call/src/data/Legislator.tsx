// TODO: make JsonAPI (De)Serializable

export class Legislator {
  id: string; // 1
  fullName: string; // Catherine Cortez Masto
  partyAffiliation: 'dem' | 'repub';
  legislatorType: 'Senator' | 'Representative';
  location: string; // Nevada
  phoneAnswerPercentage: string; // 50%
}
