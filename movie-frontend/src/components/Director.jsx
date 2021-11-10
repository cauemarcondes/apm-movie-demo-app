import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function Director({ onChange }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch("directors")
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        let directors = res.map(element => {
          return { value: element, label: element }
        });
        setOptions(directors)
        setIsLoaded(true)
      },
        (error) => {
          setError(error)
          setIsLoaded(true)
        });
  }, []);

  // react on change
  const handleChange = (selectedOptions) => {
    onChange(selectedOptions.map(o => o.value))
  }

  if (error) {
    return (
      <div>An error occured: {error.message} </div>
    )
  } else if (!isLoaded) {
    return (
      <div>Loading ...</div>
    )
  } else {
    return (
      <div>
        <Select
          options={options}
          isMulti={true}
          onChange={handleChange}
        />
      </div>
    );
  }
}

export default Director;