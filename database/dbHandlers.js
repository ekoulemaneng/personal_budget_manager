// Import JSONFilePreset from lowdb/node
import { JSONFilePreset } from 'lowdb/node';

// Create db.json and set the default data if there is no db.json 
const db = await JSONFilePreset('./database/db.json', { lastIndex: 0, envelopes: [] });

// Launch the database
export const launchDB = async () => {
  try {
    await db.write();
    console.log('Database initialized');
  } catch (error) {
    console.error('Error launching database:', error.message);
    throw new Error(`Failed to launch database: ${error.message}`);
  }
}

// Add an envelope to the database
export const addEnvelope = async (title, budget) => {
  try {
    const envelope = {
      id: db.data.lastIndex + 1,
      title,
      budget,
      spent: 0,
      remaining: budget,
    };
    db.data.envelopes.push(envelope);
    db.data.lastIndex += 1;
    await db.write();
    return envelope;
  } catch (error) {
    console.error('Error adding envelope:', error.message);
    throw new Error(`Failed to add envelope: ${error.message}`);
  }
}

// Check if an envelope title already exists
export const checkEnvelopeTitle = title => {
  try {
    const envelope = db.data.envelopes.find((envelope) => envelope.title.toLowerCase() === title.toLowerCase());
    return !!envelope;
  } catch (error) {
    console.error('Error checking envelope title:', error.message);
    throw new Error(`Failed to check envelope title: ${error.message}`);
  }
}

// Retrieve all envelopes from the database
export const getAllEnvelopes = async () => {
  try {
    return db.data.envelopes;
  } catch (error) {
    console.error('Error retrieving envelopes:', error.message);
    throw new Error(`Failed to retrieve envelopes: ${error.message}`);
  }
}

// Check by ID if an envelope exists
export const checkEnvelopeById = async (id) => {
  try {
    const envelope = db.data.envelopes.find((envelope) => envelope.id === Number(id));
    return !!envelope;
  } catch (error) {
    console.error('Error checking envelope by ID:', error.message);
    throw new Error(`Failed to check envelope by ID: ${error.message}`);
  }
}

// Retrieve an envelope by ID
export const getEnvelopeById = async (id) => {
  try {
    const envelope = db.data.envelopes.find((envelope) => envelope.id === Number(id));
    if (!envelope) return {};
    return envelope;
  } catch (error) {
    console.error('Error retrieving envelope:', error.message);
    throw new Error(`Failed to retrieve envelope: ${error.message}`);
  }
}

// Update an envelpe title by id
export const updateEnvelopeTitle = async (id, title) => {
  try {
    const envelope = db.data.envelopes.find((envelope) => envelope.id === Number(id));
    if (!envelope) return {};
    envelope.title = title;
    await db.write();
    return envelope;
  } catch (error) {
    console.error('Error updating envelope title:', error.message);
    throw new Error(`Failed to update envelope title: ${error.message}`);
  }
}

// Update an envelope budget by id reduce the budget according to the spent amount
export const updateEnvelopeBudget = async (id, expense) => {
  try {
    const envelope = db.data.envelopes.find((envelope) => envelope.id === Number(id));
    if (!envelope) return 'Envelope not found';
    if (envelope.remaining < expense) return 'Insufficient budget';
    envelope.spent += expense;
    envelope.remaining -= expense;
    await db.write();
    return envelope;
  } catch (error) {
    console.error('Error updating envelope budget:', error.message);
    throw new Error(`Failed to update envelope budget: ${error.message}`);
  }
}

// Transfer an envelope budget to another envelope
export const transferEnvelopeBudget = async (fromId, toId, amount) => {
  try {
    const fromEnvelope = db.data.envelopes.find((envelope) => envelope.id === Number(fromId));
    const toEnvelope = db.data.envelopes.find((envelope) => envelope.id === Number(toId));
    if (!fromEnvelope || !toEnvelope) return 'Envelope not found';
    if (fromEnvelope.remaining < amount) return 'Insufficient budget';
    fromEnvelope.spent += amount;
    fromEnvelope.remaining -= amount;
    toEnvelope.budget += amount;
    toEnvelope.remaining += amount;
    await db.write();
    return { fromEnvelope, toEnvelope };
  } catch (error) {
    console.error('Error transferring envelope budget:', error.message);
    throw new Error(`Failed to transfer envelope budget: ${error.message}`);
  }
}

// Delete an envelope by id
export const deleteEnvelope = async (id) => {
  try {
    const envelopeIndex = db.data.envelopes.findIndex((envelope) => envelope.id === Number(id));
    if (envelopeIndex === -1) return 'Envelope not found';
    db.data.envelopes.splice(envelopeIndex, 1);
    await db.write();
    return 'Envelope deleted';
  } catch (error) {
    console.error('Error deleting envelope:', error.message);
    throw new Error(`Failed to delete envelope: ${error.message}`);
  }
}