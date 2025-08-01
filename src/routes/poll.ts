import { Router } from "express";
import { PollController } from "../controllers";
import { authGuard, validateRequest as validate } from "../middlewares";
import {
  createPollSchema,
  updatePollSchema,
  voteSchema,
} from "../schema/poll.schema";

const router = Router();

const pollController = new PollController();

router.get("/public", pollController.handleGetPublicPolls);
router.get("/public/:pollId", pollController.handleGetPublicPoll);
router.post(
  "/public/vote/:pollId",
  validate(voteSchema),
  pollController.handlePublicVote
);

router.post(
  "/",
  authGuard,
  validate(createPollSchema),
  pollController.handleCreatePoll
);
router.get("/", authGuard, pollController.handleGetPolls);
router.get("/:pollId", authGuard, pollController.handleGetPoll);
router.patch(
  "/:pollId",
  authGuard,
  validate(updatePollSchema),
  pollController.handleUpdatePoll
);
router.delete("/:pollId", authGuard, pollController.handleDeletePoll);

router.post(
  "/vote/:pollId",
  authGuard,
  validate(voteSchema),
  pollController.handleAuthVote
);

export default router;
