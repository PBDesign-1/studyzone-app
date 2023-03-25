import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./learn.css";

function Learn () {

    const [stack, setStack] = useState()
    const [index, setIndex] = useState(0)
    const [front, setFront] = useState(true)
    const [inputVisability, setInputVisability] = useState(false)
    const [inputVisabilityToggleVisability, setInputVisabilityToggleVisability] = useState(true)

    const [status, setStatus] = useState()
    const [render, setRender] = useState(true)
    const [direction, setDirection] = useState({
        init: false,
        direction: ["answer", "question"]
    })




    const input = useRef()
    const {subjectId, stackName} = useParams()           
    // let subjectId = params.subjectId;
    // let stackName = params.stackName;

    useEffect(()=>{
        var domain = "https://puce-upset-hare.cyclic.app"     
        fetch(domain + `/data/indexcards/${subjectId}/${stackName}`)
        .then(res=>res.json())
        .then(res=>{
            setStack({indexcards: res.response.stack.indexcards.sort((a,b)=>Math.random() - 0.5), ...res.response.stack})
            
        })

    }, [subjectId, stackName])



    function leftButton (){
        if(index > 0){
            setRender(false)
            setTimeout(()=>setRender(true), 1000)


            setIndex(i=>i-1)
            if(input.current){
                input.current.value = ""
            }
            setFront(true)
            setStatus(null)
        }
    }
    function rightButton (){
        setRender(false)
        setTimeout(()=>setRender(true), 1000)       

        setIndex(i=>i+1)
        if(input.current){
            input.current.value = ""
        }
        setFront(true)
        setStatus(null)
    }

    function toggleInput (){
        setInputVisability(v=>!v)
    }

    function checkInput (e){
        setStatus((input.current.value).toLowerCase().replace(/./g, "").replace(/ *\([^)]*\) */g, "") === (stack.indexcards[index].answer).toLowerCase().replace(/./g, "").replace(/ *\([^)]*\) */g, ""))
        setFront(false)
    }

    function retry (){
        window.location.reload()
    }




    console.log(stack)

    return (
        <div className="learn">
            <div className="background"></div>
            <div className="inputVisabilityToggle" onClick={toggleInput} style={{opacity: inputVisability ? 0.3 : 1, visibility: inputVisabilityToggleVisability ? "visible" : "hidden"}}>
                <p>Wissen testen</p>
            </div>

            <div className="header">
                <h1>StudyZone</h1>
                <p>{stackName.replace(/_/gi, " ")}</p>
            </div>



            {!!stack && (index < stack.indexcards.length ? (
                !stack.changable || direction.init ? (
                <div className="content">
                    <div onClick={leftButton} className="button">
                      <img alt="" src="/arrow_left_icon.png"></img>
                    </div>

                    <div className="indexcard" onClick={()=>setFront(f=>!f)}>
                        <div className={"indexcard-front " + status} style={{transform: `rotateY(${front ? "0deg" : "180deg"})`}}>
                            <p className="indexcard-index">{index + " / " + stack.indexcards.length}</p>
                            <p>{stack.indexcards[index][direction.direction[0]]}</p>
                            <p className="indexcard-index" style={{visibility: "hidden"}}>{index + " / " + stack.indexcards.length}</p>
                        </div>   
                        <div className={"indexcard-back " + status} style={{transform: `rotateY(${front ? "180deg" : "0deg"})`}}>
                            <p className="indexcard-index" style={{visibility: "hidden"}}>{index + " / " + stack.indexcards.length}</p>
                            <p>{render && stack.indexcards[index][direction.direction[1]]}</p>
                            <p className="indexcard-index" style={{visibility: "hidden"}}>{index + " / " + stack.indexcards.length}</p>
                        </div>                      
                    </div>  

                    <div onClick={rightButton} style={{display: "flex", justifyContent: "right"}} className="button">
                        <img alt="" src="/arrow_left_icon.png" style={{transform: "rotate(180deg)"}}></img>
                    </div>
                </div>
            ): <div>
                <div className="chooseDirection">
                    <button onClick={b=>setDirection({init: true, direction: ["question", "answer"]})}>{stack.questionName + " --> " + stack.answerName}</button>
                    <button onClick={b=>setDirection({init: true, direction: ["answer", "question"]})}>{stack.answerName + " --> " + stack.questionName}</button>
                </div>
            </div>) : (
                <div className="end-screen">
                    <div>
                        <h1>Du hast {stack.indexcards.length} Karteikarten geübt</h1>
                        <button onClick={retry}>Nochmal versuchen</button>
                    </div>
                </div>
            ))}

            {!stack && <div className="loader-container"><div className="loader"></div></div>}



            {(inputVisability && index < stack.indexcards.length) && (
                <div className="input">
                    <input type="text" ref={input} onFocus={()=>setInputVisabilityToggleVisability(false)} onBlur={()=>setTimeout(()=>setInputVisabilityToggleVisability(true), 100)} />
                    <img alt="" src="/send_icon.png" className="input-input" onClick={checkInput}></img>
                </div>
            )}
            

        </div>
    )
} 

export default Learn