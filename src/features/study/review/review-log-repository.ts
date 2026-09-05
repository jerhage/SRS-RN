import type { CardId } from "../card/card";
import type { ReviewLog } from "./review-log";

interface ReviewLogRepository {
  getByCard(cardId: CardId): Promise<readonly ReviewLog[]>;
  append(log: ReviewLog): Promise<void>;
}

export type { ReviewLogRepository };
