import React from "react"
import inventoryConfig from "../../inventory-config"

class Inventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invList: []
        };
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_API_URL}/inventory`).then(res => res.json())
        .then(result => {
            let newList = [];
            result.organization_product_inventory.map(item => {
                if( inventoryConfig.InventoryType.includes(item.inventory_type) ) {
                    item['inventoryConfig'] = inventoryConfig[item.product_name]
                    newList.push(item)
                }
            })
            this.setState({
                invList: newList
            });
            this.forceUpdate();
        })
    }

    sendSelection(event, item) {
        this.props.parentCallback(item);
        event.preventDefault();
    }
    
    render() {
        const { invList } = this.state;
        let display = <p>Loading</p>;
        if (invList.length === 0)
            display = <h1>Nothing to display at this time</h1>
        else {
            display = 
            <table>
                <tbody>
                    {invList.map((item, index) => (
                        <tr key={index}>
                            <td><img src={item.inventoryConfig.imageLocation}></img></td>
                            <td>{item.product_name}</td>
                            <td>{item.inventoryConfig.customDescription}</td>
                            <td><button onClick={(e) => this.sendSelection(e, item) }>Pick Me</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        }
        return (
            <div>
                {display}
            </div>
        )
    }
}

export default Inventory;