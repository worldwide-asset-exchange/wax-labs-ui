export interface Voter {
  voter: string;
}

export interface Vote extends Voter {
  options: string[];
  ballot_name: string;
}

export interface RegVoter extends Voter {
  treasury_symbol: string;
}

export interface BallotOptions {
  key: string;
  value: string;
}
