import { useRef, useState } from "react";
import Button from "../components/core/button";

function mockingAPICall(userName: string, delay: number) {
  return new Promise<{ userName: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        userName,
      });
    }, delay);
  });
}

function Mutations() {
  const [fetchedData, setFetchedData] = useState<{ userName: string } | null>(
    null,
  );

  const selectedUser = useRef<string>(null);

  async function handleFetchData(userName: string, delay: number) {
    try {
      selectedUser.current = userName;
      const data = await mockingAPICall(userName, delay);

      // We need to check if the data.username is selectedUser.current
      if (data.userName !== selectedUser.current) {
        console.log(`This is stale data`);
        return;
      }

      setFetchedData(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        Fetched data will be displayed here: {JSON.stringify(fetchedData)}
      </div>
      <Button
        onClick={() => {
          handleFetchData("Jhon", 2000);
        }}
      >
        Fetch data Jhon
      </Button>
      <Button
        onClick={() => {
          handleFetchData("Mary", 500);
        }}
      >
        Fetch data Mary
      </Button>
      <Button
        onClick={() => {
          handleFetchData("Ram", 5000);
        }}
      >
        Fetch data Ram
      </Button>
      <Button
        onClick={() => {
          handleFetchData("Sita", 3000);
        }}
      >
        Fetch data Sita
      </Button>
    </div>
  );
}

export default Mutations;
