import React, { Component } from 'react';


export default class RowSplitter extends Component {
    render() {
        const {left, right} = this.props;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        {left}
                    </div>
                    <div className="col-md-6">
                        {right}
		            </div>
                </div>
            </div>
        );
    }
}