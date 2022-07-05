import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect} from "react";
import {SafeAreaView, StyleSheet, Text, View,FlatList, TouchableOpacity,TextInput,Alert  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {primary:'#1f145c',white:'#fff'};
export default function App() {
  const [textInput,setTextInput] = useState();
  const [todos,setTodos]=useState([
    {id:1,task:"First Todo",completed:true},
    {id:2,task:"Second Todo",completed:true},
  ]);
  useEffect(()=>{
    getTodosFromUserDevice();
  },[])
  useEffect(()=>{
    saveTodoToUserDevice(todos);
  },[todos])
  const ListItem = ({todo})=>{
    return (
        <View style={styles.listItem}>
          <View style={{flex:1}}>
            <Text style={[{fontWeight:'bold',fontSize:15,color:'#000'}, todo?.completed ? styles.strikeText : styles.unstrikeText]}>{todo?.task}</Text>
          </View>
          {
            !todo?.completed && (
              <TouchableOpacity onPress={()=>markTodoComplete(todo?.id)} style={[styles.actionIcon]}>
                <Icon name='done' size={20} color={COLORS.white} />
              </TouchableOpacity>
            )
          }
              <TouchableOpacity onPress={()=>deleteTodo(todo?.id)} style={[styles.actionIcon,{backgroundColor:'red'}]}>
                <Icon name='delete' size={20} color={COLORS.white} />
              </TouchableOpacity>
        </View>
    )
  }
  const addTodo = ()=>{
    if(textInput ===""){
      Alert.alert("Error","Please input todo")
    }else{
      const newTodo = {
        id:Math.random(),
        task:textInput,
        completed:false
      }
      setTodos([...todos,newTodo]);
      setTextInput('');
    }
 
  }
  const markTodoComplete = (todoId)=>{
    const newTodos = todos.map((item)=>{
      if(item.id == todoId){
        return {...item,completed:true}
      }
      return item;
    })
    setTodos(newTodos);
  }
  const deleteTodo = (todoId)=>{
    const newTodos = todos.filter(item=>item.id!=todoId);
    setTodos(newTodos);
  }
  const clearTodos = ()=>{
    Alert.alert("Confirm","Clear Todos???",[
      {
        text:"Yes",
        onPress:setTodos([]),
      },
      {
        text:"No"
      }
  ])
  }
  const saveTodoToUserDevice = async (todos)=>{
    try {
      const stringifyTodos = JSON.stringify(todos)
      await AsyncStorage.setItem('todos', stringifyTodos)
    } catch (e) {
      // saving error
      Alert.alert("Error","Error occured while adding to user DEvice!!!")
    }
  }
  const getTodosFromUserDevice = async ()=>{
    try{
      const todos = await AsyncStorage.getItem("todos");
      if(todos != null){
        setTodos(JSON.parse(todos));
      }
    }catch(err){
      console.log(err)
    }
  }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.white}}>
      {/***********************************************************************************/}
      <View style={styles.header}>
        <Text style={{fontWeight:'bold',fontSize:20,color:COLORS.primary}}>TODO APP</Text>
        <Icon name='delete' size={25} color="red" onPress={clearTodos}/>
      </View>
      {/***********************************************************************************/}
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding:20,paddingBottom:100}}  
        data={todos} 
        renderItem={({item})=><ListItem todo={item}/>}
      />
      {/***********************************************************************************/}
      <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Add Todo..." value={textInput} onChangeText={(text)=>setTextInput(text)}/>
          </View>
          <TouchableOpacity onPress={addTodo}>
            <View style={styles.iconContainer}>
              <Icon name="add" color={COLORS.white} size={30}/>
            </View>
          </TouchableOpacity>
      </View>
      {/***********************************************************************************/}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionIcon:{
    height:25,
    width:25,
    backgroundColor:'green',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:5,
    borderRadius:3,
  },
  listItem:{
    padding:20,
    backgroundColor:COLORS.white,
    flexDirection:'row',
    elevation:12,
    borderRadius:7,
    marginVertical:10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header:{
    marginTop:30,
    padding:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  footer:{
    position:'absolute',
    bottom:0,
    backgroundColor:COLORS.white,
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:20,
  },
  inputContainer:{
    backgroundColor:COLORS.white,
    elevation:20,
    flex:1,
    height:50,
    marginVertical:20,
    marginRight:20,
    borderRadius:30,
    paddingHorizontal:20,
    justifyContent:'center',
  },
  iconContainer:{
    height:50,
    width:50,
    backgroundColor:COLORS.primary,
    borderRadius:25,
    elevation:50,
    justifyContent:'center',
    alignItems:'center',
  },
  strikeText: {
      color: '#bbb',
      textDecorationLine: 'line-through',
      textDecorationColor:'red',
      textDecorationStyle:'dotted',
      //solid,dotted,dashed,double
  },
  unstrikeText: {
      color: "#29323c"
  }
});
