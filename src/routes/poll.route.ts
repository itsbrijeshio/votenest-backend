import { Router } from "express";
import { PollController } from "../controllers";
import { authMiddleware, validateMiddleware } from "../middlewares";
import {
  createPollSchema,
  updatePollSchema,
  voteSchema,
} from "../schema/poll.schema";

const pollController = new PollController();

const authenticated = authMiddleware;
const validated = validateMiddleware;
const validateId = validateMiddleware.validateId("pollId", "params");

const router = Router();

router.post(
  "/",
  authenticated,
  validated(createPollSchema),
  pollController.handleCreate
);
router.get("/private", authenticated, pollController.handleFindPrivateAll);
router.get("/:pollId", validateId, pollController.handleFindOne);
router.get("/", pollController.handleFindAll);
router.patch(
  "/:pollId",
  authenticated,
  validateId,
  validated(updatePollSchema),
  pollController.handleUpdateOne
);
router.delete(
  "/:pollId",
  authenticated,
  validateId,
  pollController.handleDeleteOne
);

router.post(
  "/private/vote/:pollId",
  authenticated,
  validateId,
  validated(voteSchema),
  pollController.handlePrivateVote
);
router.post(
  "/public/vote/:pollId",
  validateId,
  validated(voteSchema),
  pollController.handlePublicVote
);

export default router;
