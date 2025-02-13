export default function Button({color,count,onClick}){
    return(
        <button style={{'color':color}} onClick={onClick}>Count {count}</button>
    );
    
}