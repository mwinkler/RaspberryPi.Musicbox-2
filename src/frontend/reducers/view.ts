
export default function (state = "player", action) {

    switch (action.type) {
        
        case 'VIEW/SET_VIEW':
            state = action.payload;
            break;
    }

    return state;
}