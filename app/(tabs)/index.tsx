import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import Header from "@/components/header";
import Allitems from "@/components/allitems";
import Allpantries from "@/components/allpantries";
import SearchBar from "@/components/searchbar";
import Colors from "@/constants/Colors";

const tab = [
  {
    name: "All pantries",
  },
  {
    name: "All items",
  },
];

const index = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const selectTab = (index: number) => {
    setActiveIndex(index);
    console.log("On " + tab[index].name + " tab");
  };

  return (
    <View style={styles.container}>
    
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />
    
      <SearchBar />

      <View style={styles.tabContainer}>
        {tab.map((item, index) => (
          <TouchableOpacity
            onPress={() => selectTab(index)}
            key={index}
            style={[
              styles.tab,
              activeIndex === index ? styles.activeTab : styles.inactiveTab,
            ]}
          >
            <Text style={{ fontFamily: "mon-sb", color:'white' }}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeIndex === 0 && <Allpantries />}
      {activeIndex === 1 && <Allitems />}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    width: 150,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: Colors.active,
    
  },
  inactiveTab: {
    backgroundColor: Colors.inactive,
  },
  contentContainer: {
    marginTop: 20,
    padding: 15,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  pantry: {
    backgroundColor: "black",
    height: 300,
    alignItems: "center",
  },
});

export default index;
