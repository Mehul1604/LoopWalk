import { createBrowserRouter } from "react-router";
import { IntroScreen } from "./components/IntroScreen";
import { StartScreen } from "./components/StartScreen";
import { GoalSelectionScreen } from "./components/GoalSelectionScreen";
import { CalibratedMapScreen } from "./components/CalibratedMapScreen";
import { ActiveNavigationScreen } from "./components/ActiveNavigationScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: IntroScreen,
  },
  {
    path: "/start",
    Component: StartScreen,
  },
  {
    path: "/goals",
    Component: GoalSelectionScreen,
  },
  {
    path: "/walk",
    Component: CalibratedMapScreen,
  },
  {
    path: "/navigate",
    Component: ActiveNavigationScreen,
  },
]);