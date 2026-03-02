import sys
from qiskit import QuantumCircuit
from qiskit.circuit.library import GroverOperator
from qiskit_aer import AerSimulator

name_to_index = {
    "A1": 0,
    "B2": 1,
    "C3": 2,
    "D4": 3
}

def grover_search_by_name(query_name: str):
    if query_name not in name_to_index:
        return {"found": False, "id": None, "index": None}

    target_index = name_to_index[query_name]
    n = 2
    
    oracle = QuantumCircuit(n)
    bin_str = f"{target_index:02b}"
    for i, bit in enumerate(reversed(bin_str)):
        if bit == '1':
            oracle.x(i)
    oracle.cz(0, 1)
    for i, bit in enumerate(reversed(bin_str)):
        if bit == '1':
            oracle.x(i)

    grover_op = GroverOperator(oracle)
    qc = grover_op.construct_circuit()
    qc.measure_all()

    simulator = AerSimulator()
    result = simulator.run(qc, shots=1024).result()
    counts = result.get_counts()

    measured = max(counts, key=counts.get)
    found_index = int(measured, 2)

    return {
        "found": True,
        "id": found_index,
        "index": found_index,
        "measured": measured,
        "counts": counts
    }

if __name__ == "__main__":
    query = sys.argv[1]
    result = grover_search_by_name(query)
    print(result)