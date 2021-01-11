import {useState, useEffect} from 'react';
import * as GLOBAL_VARS from './vars';
import {Serialize} from 'eosjs';
import {Uint64LE} from 'int64-buffer';
import * as waxjs from "@waxio/waxjs/dist";


export function randomEosioName(length=12){
    var result = '';
    var validCharacters = "12345abcdefghijklmnopqrstuvxyz"
    for(let i = 0; i < length; i++){
        result += validCharacters.charAt(Math.floor(Math.random() * validCharacters.length))
    }
    return result;
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function numberWithCommas(n) {
    let parts=n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

export function requestedAmountToFloat(requestedAmount, symbol=" WAX"){
    return parseFloat(requestedAmount.slice(0, -symbol.length))
}

export function getStatBounds(statusKey){
    let reversedArray = new Uint8Array(8);
    reversedArray.set([statusKey], 7);


    let lowerBound = new Uint64LE(reversedArray).toString(10);

    for(let i=0; i<7; i++){
        reversedArray.set([0xff], i);
    }

    const upperBound = new Uint64LE(reversedArray).toString(10);


    return {
        lowerBound: lowerBound,
        upperBound: upperBound,
    }
}

export function getNameBounds(statusKey, name){
    const sb = new Serialize.SerialBuffer({
        textEncoder: new TextEncoder(),
        textDecoder: new TextDecoder()
    });
    sb.pushName(name);

    let reversedArray = new Uint8Array(16);
    reversedArray.set(sb.array.slice(0,8).reverse());
    reversedArray.set([statusKey], 8);

    const lowerHexIndex = Buffer.from(reversedArray).toString('hex');
    let lowerBound = '0x' + lowerHexIndex;

    for(let i=9; i<16; i++){
        reversedArray.set([0xff], i);
    }

    const upperHexIndex = Buffer.from(reversedArray).toString('hex');
    const upperBound = '0x' + upperHexIndex;

    return {
        lowerBound: lowerBound,
        upperBound: upperBound,
    }
}

export async function getProposals(queryType, statusKey, getBounds, accountName){

    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    let {lowerBound, upperBound} = getBounds(statusKey, accountName);

    console.log("getting proposals, accountName: ", accountName, " queryType:", queryType, " statusKey: ", statusKey);
    let success = false;
    let proposalsArray = []
    do{
        proposalsArray = []
        try {

            let resp = {}
            do{
                resp = await wax.rpc.get_table_rows({
                    code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    scope: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                    table: GLOBAL_VARS.PROPOSALS_TABLE,
                    json: true,
                    key_type: GLOBAL_VARS.PROPOSAL_INDEXES.KEY_TYPE[queryType],
                    index_position: GLOBAL_VARS.PROPOSAL_INDEXES.INDEX_POSITION[queryType],
                    lower_bound: lowerBound,
                    upper_bound: upperBound,
                    limit: 1000,
                });
                if(resp.rows){
                    proposalsArray = [...proposalsArray, ...resp.rows]
                }
                lowerBound = resp.next_key;
            }while(resp.more)

            success = true;
        } catch(e) {
            console.log(e);
            success = false;
        }
    }while(!success)

    return proposalsArray;
}


export function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      breakpoint: 'mobile',
    });
    // Handler to call on window resize


    useEffect(() => {
      const handleResize = () => {
        // Set window width/height to state
        let width = window.innerWidth;
        let breakpoint = "mobile";
        if (width >= 577 && width <= 767){
            breakpoint = "tablet_mobile_up"
        }
        else if(width >= 768 && width <= 991){
            breakpoint = "tablet_up"
        }
        else if(width >= 992 && width <= 1199) {
            breakpoint = "tablet_landscape_up"
        }
        else if( width >= 1200){
            breakpoint = "desktop"
        }
        setWindowSize({
          breakpoint: breakpoint,
        });
      }


      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
}

export function tagStyle(tagState, deliverable=false) {
    let tagClass;
    if (deliverable) {
        switch(tagState) {
            case GLOBAL_VARS.REJECTED_KEY:
                tagClass='tag--negative';
                break;
            case GLOBAL_VARS.REPORTED_KEY:
                tagClass='tag--attention';
                break;
            case GLOBAL_VARS.ACCEPTED_KEY:
            case GLOBAL_VARS.CLAIMED_KEY:
                tagClass='tag--positive';
                break;
            default:
                tagClass='tag--neutral';
        }
    } else {
        switch(tagState) {
            case GLOBAL_VARS.FAILED_KEY:
            case GLOBAL_VARS.CANCELLED_KEY:
                tagClass='tag--negative';
                break;
            case GLOBAL_VARS.VOTING_KEY:
            case GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY:
                tagClass='tag--attention';
                break;
            case GLOBAL_VARS.APPROVED_KEY:
            case GLOBAL_VARS.COMPLETED_KEY:
                tagClass='tag--positive';
                break;
            default:
                tagClass='tag--neutral';
        }
    }
    return tagClass;
}