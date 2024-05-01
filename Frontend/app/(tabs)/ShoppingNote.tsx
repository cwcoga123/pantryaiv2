import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack } from "expo-router";
import Header from "@/components/header";
import { useAuth } from "../context/AuthContext";
import { useServerUrl } from "../context/ServerUrlContext"; // Make sure the path is correct

const ShoppingNote = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');
  const serverUrl = useServerUrl();  // Using the server URL from the context
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    if (!user || user.id === undefined) {
      console.log("User ID is not set. Please log in.");
      return;
    }
    try {
      const response = await fetch(`${serverUrl}/get_notes?user_id=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setNotes(data);
      } else {
        throw new Error(data.error || 'Failed to fetch notes');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const addNote = async () => {
    if (input.trim() && user) {
      try {
        const response = await fetch(`${serverUrl}/backend/add_note`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: input.trim(), user_id: user.id }),
        });
        const data = await response.json();
        if (response.ok) {
          setNotes([...notes, { id: data.note_id, content: input.trim() }]);
          setInput('');
        } else {
          throw new Error(data.error || 'Failed to add note');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Input Error', 'Please enter a note or check login status');
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`${serverUrl}/backend/delete_note?note_id=${noteId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setNotes(notes.filter(note => note.id !== noteId));
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete note');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Render the component UI
  return (
      <View style={styles.container}>
        <Stack.Screen
            options={{
              header: () => <Header />,
            }}
        />
        <Text style={styles.header}>Shopping Notes</Text>
        <ScrollView>
          {notes.map((note) => (
              <View key={note.id} style={styles.noteItem}>
                <Text style={styles.noteText}>• {note.content}</Text>
                <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
          ))}
        </ScrollView>
        <TextInput
            style={styles.input}
            placeholder="Enter a note..."
            placeholderTextColor="gray"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={addNote}
        />
        <TouchableOpacity onPress={addNote} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Note</Text>
        </TouchableOpacity>
      </View>
  );
};

// Define your styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteText: {
    fontSize: 16,
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#F00',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default ShoppingNote;
