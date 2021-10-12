import React from "react";

class AddressInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      street_line1: "",
      street_line2: "",
      street_line3: "",
      city: "",
      postal_code: "",
      region: "",
      country_code_2: "",
      isLoading: false,
      requestMade: false,
      addressStatus: false,
    };
  }

  componentDidMount() {
    //This is where we can build a connector to pull an address from the user profile, to implement late
    this.setState({
      street_line1: "1111 Rusk St",
      street_line2: "1116",
      street_line3: "",
      city: "Houston",
      postal_code: "77002",
      region: "TX",
      country_code_2: "US",
    });
  }

  handleChanges(evt) {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  async submitVerify(event) {
    event.preventDefault();
    this.setState({
      isLoading: true,
      requestMade: true,
    });
    this.forceUpdate();
    const body = {
      street_line1: this.state.street_line1,
      street_line2: this.state.street_line2,
      street_line3: this.state.street_line3,
      city: this.state.city,
      postal_code: this.state.postal_code,
      region: this.state.region,
      country_code_2: this.state.country_code_2,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    const URL = process.env.REACT_APP_API_URL + "/address";
    await fetch(URL, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if(data.status === 'undeliverable') {
            this.setState({
                addressStatus: false,
                isLoading: false,
              });
        } else if(data.status === 'deliverable') {
            this.setState({
                addressStatus: true,
                isLoading: false,
              });
        }
        this.forceUpdate();
      });
  }

  sendVerifiedAddress(event) {
    event.preventDefault();
    const address = {
        street_line1: this.state.street_line1,
        street_line2: this.state.street_line2,
        street_line3: this.state.street_line3,
        city: this.state.city,
        postal_code: this.state.postal_code,
        region: this.state.region,
        country_code_2: this.state.country_code_2,
      }
    this.props.parentCallbackAddr(address);
}

  render() {
    let loading = <div></div>;
    if (this.state.requestMade) {
      if (this.state.isLoading) {
        loading = <h3>Fetching request</h3>;
      } else {
        if (this.state.addressStatus) {
          loading = (<div>
            <h3>Your address is valid, press continue</h3>
            <button onClick={(e) => this.sendVerifiedAddress(e) }>Continue</button>
          </div>);
        } else {
          loading = <h3>Your address is not valid, please correct, and submit again</h3>;
        }
      }
    }
    return (
        <div>
      <form>
        <label>
          Address Line 1
          <input
            type="text"
            name="street_line1"
            value={this.state.street_line1}
            onChange={this.handleChanges.bind(this)}
          ></input>
        </label>
        <br />
        <label>
          Address Line 2
          <input
            type="text"
            name="street_line2"
            value={this.state.street_line2}
            onChange={this.handleChanges.bind(this)}
          ></input>
        </label>
        <br />
        <label>
          Address Line 3
          <input
            type="text"
            name="street_line3"
            value={this.state.street_line3}
            onChange={this.handleChanges.bind(this)}
          ></input>
        </label>
        <br />
        <label>
          City
          <input
            type="text"
            name="city"
            value={this.state.city}
            onChange={this.handleChanges.bind(this)}
          ></input>
        </label>
        <label>
          Postal Code
          <input
            type="text"
            name="postal_code"
            value={this.state.postal_code}
            onChange={this.handleChanges.bind(this)}
          ></input>
        </label>
        <br />
        <label>
          Region
          <input
            type="text"
            name="region"
            value={this.state.region}
            onChange={this.handleChanges.bind(this)}
          ></input>
        </label>
        <br />
        <label>
          Country Code
          <input
            type="text"
            name="country_code_2"
            value={this.state.country_code_2}
            onChange={this.handleChanges.bind(this)}
          ></input>
        </label>
        <br />
        <input
          type="submit"
          value="Submit"
          onClick={this.submitVerify.bind(this)}
        />
      </form>
      {loading}
      </div>
    );
  }
}

export default AddressInput;
