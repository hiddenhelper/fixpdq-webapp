import { models } from "@fixpdq/common";
import {
  WORKITEM_STATUS_ACTIVE_C,
  WORKITEM_STATUS_ACTIVE_W,
  WORKITEM_STATUS_DONE_C,
  WORKITEM_STATUS_DONE_W,
  WORKITEM_STATUS_ON_HOLD_C,
  WORKITEM_STATUS_ON_HOLD_W,
  WORKITEM_STATUS_OPEN_C,
  WORKITEM_STATUS_OPEN_W,
  WORKITEM_STATUS_REOPEN_C,
  WORKITEM_STATUS_REOPEN_W,
  WORKITEM_STATUS_REVIEW_C,
  WORKITEM_STATUS_REVIEW_W,
} from "../../utils/static-images";

export const STATUS = models.workitemsState.STATUS;
export const ACTION = models.workitemsState.ACTION;
export const TRANSITIONS = models.workitemsState.TRANSITIONS;

export const REFRESH_WORKITEM_INTERVAL = 30 * 1000;

const capitalizeFirstChar = (string) => {
  if (string) {
    const name = string.toLowerCase().replace(/[_-][a-z]/g, (match, token) => {
      return match.toUpperCase().replace(/_/g, " ");
    });
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
};

export const WORKITEM_STATUS = [
  {
    id: 0,
    bgColor: "fix_background_green",
    title: capitalizeFirstChar(STATUS.ACTIVE),
    value: STATUS.ACTIVE,
    icon: "play circle outline",
    active: true,
    src_c: WORKITEM_STATUS_ACTIVE_C,
    src_w: WORKITEM_STATUS_ACTIVE_W,
  },
  {
    id: 1,
    bgColor: "fix_background_blue",
    title: capitalizeFirstChar(STATUS.ON_HOLD),
    value: STATUS.ON_HOLD,
    icon: "pause circle outline",
    active: true,
    src_c: WORKITEM_STATUS_ON_HOLD_C,
    src_w: WORKITEM_STATUS_ON_HOLD_W,
  },
  {
    id: 2,
    bgColor: "fix_background_yellow2",
    title: capitalizeFirstChar(STATUS.REVIEW),
    value: STATUS.REVIEW,
    icon: "step backward",
    active: true,
    src_c: WORKITEM_STATUS_REVIEW_C,
    src_w: WORKITEM_STATUS_REVIEW_W,
  },
  {
    id: 3,
    bgColor: "fix_background_pink",
    title: capitalizeFirstChar(STATUS.REOPEN),
    value: STATUS.REOPEN,
    icon: "undo",
    active: true,
    src_c: WORKITEM_STATUS_REOPEN_C,
    src_w: WORKITEM_STATUS_REOPEN_W,
  },
  {
    id: 4,
    bgColor: "fix_background_grey2",
    title: capitalizeFirstChar(STATUS.NEW),
    value: STATUS.NEW,
    icon: "dot circle outline",
    active: true,
    src_c: WORKITEM_STATUS_OPEN_C,
    src_w: WORKITEM_STATUS_OPEN_W,
  },
  {
    id: 5,
    bgColor: "fix_background_olive",
    title: capitalizeFirstChar(STATUS.DONE),
    value: STATUS.DONE,
    icon: "stop circle outline",
    active: true,
    src_c: WORKITEM_STATUS_DONE_C,
    src_w: WORKITEM_STATUS_DONE_W,
  },

  {
    id: 6,
    bgColor: "",
    title: capitalizeFirstChar(STATUS.DELETED),
    value: STATUS.DELETED,
    icon: "undo",
    active: false,
    src_c: "",
    src_w: "",
  },
];

export const WORKITEM_STATUS_DROPDOWN = WORKITEM_STATUS.filter(
  (s) => s.active
).map((s) => {
  return {
    key: s.id,
    text: s.title,
    value: s.value,
    image: {
      avatar: true,
      src: s.src_c,
    },
    // icon: s.icon,
    // color: s.color,
  };
});

export const WORKITEMS_ACTION_ICONS = [
  {
    id: ACTION.ASSIGN,
    color: "fix_icon_action_green_10",
    icon: "lock",
    text: "Accountability Contract",
    bgColor: "fix_background_green",
  },
  {
    id: ACTION.REQUEST_REVIEW,
    color: "fix_icon_action_yellow2_10",
    icon: "quote right",
    text: "Opinion",
    bgColor: "fix_background_yellow2",
  },
  {
    id: "collaboration",
    color: "fix_icon_action_ginger_10",
    icon: "cut",
    text: "Collaboration",
    bgColor: "fix_background_ginger",
  },
  {
    id: "housekeeping",
    color: "fix_icon_action_orange_10",
    icon: "cut",
    text: "Housekeeping",
    bgColor: "fix_background_orange",
  },
  {
    id: "question",
    color: "fix_icon_action_red_10",
    icon: "cut",
    text: "Question",
    bgColor: "fix_background_red",
  },
];

export const POSITION_ACTION = {
  ADD: "add",
  INDENT: "indent",
  OUTDENT: "outdent",
  CHANGE_PARENT: "changeParent",
  CHANGE_SWARM: "changeSwarm",
  ADD_PLAYBOOK: "addPlaybook",
  CHANGE_NEXT: "changeNext",
  DELETE: "delete",
  CREATE_FOR_MENTIONS: "createForMentions",
};

export const PRIORITY_DIFFICULTY_STATUS = [
  {
    value: 0,
    name: "LOW",
    color: "blue",
    color_card: "fix_icon_bar_10",
  },
  {
    value: 1,
    name: "MEDIUM",
    color: "green",
    color_card: "fix_icon_action_yellow2_10",
  },
  {
    value: 2,
    name: "HIGH",
    color: "orange",
    color_card: "fix_icon_action_ginger_10",
  },
  {
    value: 3,
    name: "INSANE",
    color: "red",
    color_card: "fix_icon_action_red_10",
  },
];

export const REMIND_WORKITEM_STATUS = {
  NEW: "remind-workitem-has-status-new",
  ON_HOLD: "remind-workitem-has-status-on-hold",
  UNASSIGNED: "remind-workitem-unassigned",
  DUE_TODAY: "remind-workitem-due-today",
};

export const DUE_DATE = [
  "Late",
  "Today",
  "Tomorrow",
  "1 Week",
  "2 Weeks",
  "2 Weeks+",
];
export const MAX_ACTION_DISPLAY_COUNT = 3; // used for people card
export const MAX_PARTICIPANTS_AVATAR_COUNT = 5; //used for Workitem Conversation Pane

Object.freeze(POSITION_ACTION);
