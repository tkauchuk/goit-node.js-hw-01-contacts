const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, './db/contacts.json');

async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath);
        const contacts = JSON.parse(data);
        return contacts;
    } catch (error) {
        console.error(error.message);
    }
}

async function getContactById(contactId) {
    try {
        const contacts = await listContacts();
        const requiredContact = contacts.find(({ id }) => {
            return id === contactId;
        });
        return requiredContact;
    } catch (error) {
        console.error(error.message);
    }
}

async function removeContact(contactId) {
    try {
        const contacts = await listContacts();
        const requiredContactIdx = contacts.findIndex(({ id }) => id === contactId);

        if (requiredContactIdx === -1) {
            console.log(`Contact with an ID ${contactId} doesn't exist.`);
            return null;
        }
        const updatedContacts = contacts.filter((_, index) => requiredContactIdx !== index);
        await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
        return contacts[requiredContactIdx];
    } catch (error) {
        console.error(error.message);
    }
}

async function addContact(name, email, phone) {
    try {
        const contacts = await listContacts();
        const newContact = { id: uuidv4(), name, email, phone };
        const updatedContacts = [...contacts, newContact];
        await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
        return newContact;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
