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

export interface Ballot {
  ballot_name: string;
  category: string;
  publisher: string;
  status: string;
  title: string;
  description: string;
  content: string;
  treasury_symbol: string;
  voting_method: string;
  min_options: number;
  max_options: number;
  options: BallotOptions[];
  total_voters: number;
  total_delegates: number;
  total_raw_weight: string;
  cleaned_count: number;
  settings: BallotOptions[];
  begin_time: string;
  end_time: string;
}

export interface VotingData {
  yes: number | null;
  no: number | null;
  endTime: Date | null;
  endTimeString: string | null;
  ended: boolean;
}
