import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Posts from "./Blogs";
import { newRequest } from "../services/newRequest";
import { Skeleton } from "@mui/material";
import { ApiStatus } from "../Enums/ApiStatus";
import { isAuthenticated } from "../utils/Auth";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [forYouData, setForYouData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [follwedBlogs, setFollwedBlogs] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    newRequest("/blog")
      .then((res) => {
        setLoading(false);
        setForYouData(res.data?.blogs);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

    isAuthenticated() &&
      newRequest("/blog/user/followed")
        .then((res) => {
          // setLoading(false);
          console.log(res.data, "follwed");
          if (res.data?.status == ApiStatus.success) {
            setFollwedBlogs(res.data?.data);
            return;
          }
        })
        .catch((err) => {
          // setLoading(false);
          console.log(err);
        });
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          position: "sticky",
          top: 0,
          bgcolor: "white",
          zIndex: 998,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="For you" {...a11yProps(0)} />
          {isAuthenticated() && <Tab label="following" {...a11yProps(1)} />}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {loading ? (
          <div className="flex flex-col gap-5 divide-y">
            <Box sx={{ paddingBottom: 4 }}>
              <Skeleton variant="rectangular" width={"100%"} height={20} />
              <br />
              <Skeleton variant="rectangular" width={"100%"} height={60} />
              <br />
              <Skeleton variant="rectangular" width={"100%"} height={30} />
            </Box>
            <Box sx={{ paddingBottom: 4 }}>
              <Skeleton variant="rectangular" width={"100%"} height={20} />
              <br />
              <Skeleton variant="rectangular" width={"100%"} height={60} />
              <br />
              <Skeleton variant="rectangular" width={"100%"} height={30} />
            </Box>
          </div>
        ) : (
          <Posts data={forYouData} />
        )}
      </TabPanel>
      {isAuthenticated() && (
        <TabPanel value={value} index={1}>
          {loading ? (
            <div className="flex flex-col gap-5 divide-y">
              <Box sx={{ paddingBottom: 4 }}>
                <Skeleton variant="rectangular" width={"100%"} height={20} />
                <br />
                <Skeleton variant="rectangular" width={"100%"} height={60} />
                <br />
                <Skeleton variant="rectangular" width={"100%"} height={30} />
              </Box>
              <Box sx={{ paddingBottom: 4 }}>
                <Skeleton variant="rectangular" width={"100%"} height={20} />
                <br />
                <Skeleton variant="rectangular" width={"100%"} height={60} />
                <br />
                <Skeleton variant="rectangular" width={"100%"} height={30} />
              </Box>
            </div>
          ) : (
            <Posts data={follwedBlogs} />
          )}
        </TabPanel>
      )}
    </Box>
  );
}
