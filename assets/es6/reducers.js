import { createStore } from 'redux'

export const wvReducer = (state = {}, action) => {

    switch(action.type){

        case 'ADD_BRICK':
            return {
                title: state.title,
                author: state.author,
                featured_image: state.featured_image,
                bricks: [{id: action.id, text: action.text}]
            }

        default:
            return state;
    }
};


// const testReducer = () => {

//     const stateBefore = {
//         title: "bob dylan",
//         author: "kubante",
//         featured_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bob_Dylan_in_November_1963-5.jpg/220px-Bob_Dylan_in_November_1963-5.jpg",
//         bricks: []
//     };

//     const action = {
//         type: 'ADD_BRICK',
//         id: 0,
//         text: 'A brick dummy text'
//     };

//     const stateAfter = {
//         title: "bob dylan",
//         author: "kubante",
//         featured_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bob_Dylan_in_November_1963-5.jpg/220px-Bob_Dylan_in_November_1963-5.jpg",
//         bricks: [
//             {
//                 id: 0,
//                 text: 'A brick dummy text'
//             }
//         ]
//     };

//     deepFreeze(stateBefore);
//     deepFreeze(action);

//     expect(wvReducer(stateBefore, action)).toEqual(stateAfter);
// }
// testReducer();
// console.log("all tests passed");

// const { createStore } = Redux;
// const store = createStore(wvReducer);

// store.dispatch({type: "addBrick"});

// console.log(store.getState());
// 
// {
//   "title": "bob dylan",
//   "author": "kubante",
//   "featured_image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bob_Dylan_in_November_1963-5.jpg/220px-Bob_Dylan_in_November_1963-5.jpg",
//   "search_history": {
//     "bob dylan": 15,
//     "bergen": 150
//   },
//   "bricks": {}
// }