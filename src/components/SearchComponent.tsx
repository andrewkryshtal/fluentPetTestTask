import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface ISearchComponent {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterAgeRange: { min: number; max: number };
  setFilterAgeRange: (range: { min: number; max: number }) => void;
  filterWithDescription: boolean;
  setFilterWithDescription: (value: boolean) => void;
}

export const SearchComponent = ({
  searchQuery,
  setSearchQuery,
  filterAgeRange,
  setFilterAgeRange,
  filterWithDescription,
  setFilterWithDescription,
}: ISearchComponent) => {
  return (
    <View style={styles.filterContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search pets by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text>Age Range:</Text>
      <TextInput
        style={styles.filterInput}
        placeholder="Min Age"
        keyboardType="numeric"
        value={filterAgeRange.min.toString()}
        onChangeText={(text) =>
          setFilterAgeRange({ ...filterAgeRange, min: Number(text) || 0 })
        }
      />
      <TextInput
        style={styles.filterInput}
        placeholder="Max Age"
        keyboardType="numeric"
        value={filterAgeRange.max.toString()}
        onChangeText={(text) =>
          setFilterAgeRange({ ...filterAgeRange, max: Number(text) || 100 })
        }
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          onPress={() => setFilterWithDescription(!filterWithDescription)}
          style={[
            styles.checkbox,
            filterWithDescription && styles.checkboxChecked,
          ]}
        >
          {filterWithDescription && <Text style={styles.checkboxText}>✓</Text>}
        </TouchableOpacity>
        <Text>Only Pets with Description</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterInput: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 5,
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 3,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
  },
  checkboxText: {
    color: "white",
  },
});
