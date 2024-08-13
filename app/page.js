'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'

// import firebase things
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'


// style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  // We'll add our component logic here
  // state management for food
  const [inventory, setInventory] = useState([])
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)

  const [itemName, setItemName] = useState(' ')
  const [itemNumber, setItemNumber] = useState(1)
  const [searchName, setSearchName] = useState('')


  
  

  // function for updating the inventory from the server
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      // filter for search keyword
      // if item name contains search word or search word is empty, add to list
      if(doc.id.includes(searchName) || searchName.trim().length === 0 || !searchName || searchName === 0) 
      {
        inventoryList.push({ name: doc.id, ...doc.data() })
      }
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [searchName])

  // function for adding things into the database
  const addItem = async (item, amount) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: +quantity + +amount })
    } else {
      await setDoc(docRef, { quantity: +amount })
    }
    await updateInventory()
  }
  
  // function for removing things into the database
  const removeItem = async (item, number) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === NaN || quantity === 1 || +quantity - +number <= 0) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: +quantity - +number })
      }
    }
    await updateInventory()
  }

  // functions to manage modal state
  const addOpen = () => setOpen1(true)
  const addClose = () => setOpen1(false)

  const removeOpen = () => setOpen2(true)
  const removeClose = () => setOpen2(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
    
    <Stack direction="row" spacing={2}>
        <TextField
          id="outlined-basic"
          label="item name"
          variant="outlined"
          fullWidth
          value={searchName.toLowerCase()}
          onChange={(e) => {
            setSearchName(e.target.value)
            updateInventory()
            }}
        />
        {
          // <Button variant="contained" onClick={findInventory(searchName)}>
          //   Search
          // </Button>
        }
      </Stack>

      <Stack direction="row" spacing={2}>
      {
        // modal for add button
      }
        <Button variant="contained" onClick={addOpen}>
          Add New Item
        </Button>
        <Modal
          open={open1}
          onClose={addClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName.toLowerCase()}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Quantity"
                variant="outlined"
                inputProps={{ type: 'number'}}
                fullWidth
                value={itemNumber}
                onChange={(e) => setItemNumber(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName, itemNumber)
                  setItemName('')
                  setItemNumber(1)
                  addClose()
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        
        {
          // modal for remove button
        }
        <Button variant="contained" onClick={removeOpen}>
          Remove New Item
        </Button>
        <Modal
          open={open2}
          onClose={removeOpen}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Remove Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName.toLowerCase()}
                onChange={(e) => setItemName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Quantity"
                variant="outlined"
                inputProps={{ type: 'number'}}
                fullWidth
                value={itemNumber}
                onChange={(e) => setItemNumber(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  removeItem(itemName, itemNumber)
                  setItemName('')
                  setItemNumber(1)
                  removeClose()
                }}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Stack>

      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="600px" spacing={1} overflow={'auto'}>
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="75px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={10}
            >
              <Typography variant={'h5'} color={'#333'} textAlign={'left'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h6'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>

              <Box
              key={name}
              width="50%"
              minHeight="75px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={18}
            >
                <Button variant="contained" onClick={() => addItem(name, 1)}>
                  +1
                </Button>
                <Button variant="contained" onClick={() => removeItem(name, 1)}>
                  -1
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
