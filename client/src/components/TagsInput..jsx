import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

function TagsInput({ tags, setTags }) {
  const handleAddTag = (event, value) => {
    console.log(value);
    // setTags([]);
    setTags(value);
  };

  return (
    <Autocomplete
      multiple
      options={["react", "javascript", "html", "css"]}
      freeSolo
      onChange={handleAddTag}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Tags"
          placeholder="Add tags"
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((tag, index) => (
          <div
            key={tag}
            {...getTagProps({ index })}
            style={{
              backgroundColor: "#e0e0e0",
              padding: "5px",
              borderRadius: "5px",
              marginRight: "5px",
            }}
          >
            {tag}
            {/* <span onClick={() => handleDeleteTag(tag)}>×</span> */}
          </div>
        ))
      }
    />
  );
}

export default TagsInput;
