export interface RetroCard {
  id: string;
  author: string;
  content: string;
  points: number;
  isBlurred: boolean;
}

export interface RetroColumn {
  id: string;
  columnTitle: string;
  itemIds: string[];
}

export interface RetroBoard {
  boardId: string;
  title: string;
  format: string;
  items: {
    [key: string]: RetroCard;
  };
  columns: {
    [key: string]: RetroColumn;
  };
  columnOrder: string[];
  error: boolean;
  isBlurred: boolean;
  maxVoteCount: number;
  showContinueDiscussion: boolean;
  continueDiscussionVotes: {
    yes: number;
    no: number;
    abstain: number;
  };
}

export interface Poker {
  pokerId: string;
  story: string;
  error: boolean;
  participants: PokerUser[];
}

interface PokerUser {
  name: string;
  vote: number;
  voted: false;
}
