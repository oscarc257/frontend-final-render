// Import the TabComponent for rendering tabs
import TabComponent from "../components/TabComponent";
// Import the MainContainer component for wrapping the content
import MainContainer from "../components/Containers/MainContainer";

// TransactionsRoot component serves as the root page for transaction-related actions
const TransactionsRoot = () => {
  // Define the tabs for the page
  const tabs = [
    {
      name: "Create", // Tab name displayed to the user
      link: "create", // Link to navigate to the "create" route
    },
    {
      name: "Delete", // Tab name displayed to the user
      link: "delete", // Link to navigate to the "delete" route
    },
  ];

  return (
    // Wrap the content in the MainContainer for consistent layout
    <MainContainer>
      {/* Render the TabComponent with the defined tabs and base URL */}
      <TabComponent Tabs={tabs} baseUrl="transactions" />
    </MainContainer>
  );
};

// Export the TransactionsRoot component for use in other parts of the application
export default TransactionsRoot;
