import CreateVault from "@/components/CreateVault";
import ListVault from "@/components/ListVault";

export default function Home() {
  return (
    <div id="home">
      <CreateVault />
      <ListVault />
    </div>
  );
}
