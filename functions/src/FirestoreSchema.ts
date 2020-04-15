import * as Zoom from "./Meeting";
import { Participant } from "./Participant";

export type Meeting = Zoom.Meeting & { participants: Participant[] };
