import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
//@ts-ignore
import { withTransaction } from "@elastic/apm-rum-react";

async function fetchDirectors() {
  const { data: directors } = await axios.get<string[]>("/directors");
  return directors;
}

function Director({ onChange }: any) {
  const [error, setError] = useState<Error | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );

  useEffect(() => {
    async function callFetchDirectors() {
      setIsLoaded(true);
      try {
        const directors = await fetchDirectors();
        setOptions(
          directors.map((director) => ({
            value: director,
            label: director,
          }))
        );
      } catch (e) {
        setError(e as Error);
      }
      setIsLoaded(false);
    }
    callFetchDirectors();
  }, []);

  const handleChange = (selectedOptions: any) => {
    onChange(selectedOptions.map((o: any) => o.value));
  };

  if (error) {
    return <div>An error occured: {error.message} </div>;
  }

  if (isLoaded) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <Select options={options} isMulti={true} onChange={handleChange} />
    </div>
  );
}
export default withTransaction("Director", "component")(Director);
