import { useAppDependencies } from "@/composition/app-dependencies-provider";
import { DecksComparisonScreen } from "@/features/study/presentation/decks-comparison-screen";

function HomeScreen() {
  const { study } = useAppDependencies();

  return (
    <DecksComparisonScreen
      clock={study.clock}
      decks={study.decks}
      idGenerator={study.idGenerator}
    />
  );
}

export default HomeScreen;
